import React, { useEffect, useState } from 'react';
import Matrix from "../../Matrix";
import config from '../../config.json'
//import adminList from "../../assets/data/admin.json"
import { Loading } from "../../components/loading";
import FetchFaq from '../../components/matrix_fetch_faq'
import { useTranslation } from 'react-i18next';
import debounce from "lodash/debounce";
import Editor from "rich-markdown-editor";
import showdown from "showdown"
import { useAuth } from "../../Auth";
import { setInterval } from 'timers';
import { type } from 'os';
//import { useTranslation, Trans } from 'react-i18next';

const Admin = () => {
  const matrixClient = Matrix.getMatrixClient();
  const [admin, setAdmin] = useState('checking');
  const [count, setCount] = useState(0); //hack to update view since array.splice doesnt seem to trigger effect hook
  const [loading, setLoading] = useState(false);
  const { i18n } = useTranslation(['translation', 'support']);
  const converter = new showdown.Converter()
  const { faq, error, fetching, onSave } = FetchFaq((index) => {
    console.log(error, fetching)
  });
  const [initalLength, setInitalLength] = useState(faq.length);
  const faqPath = i18n.language === "en" ? config.faq.en : config.faq.de;
  const onlineUsers = []
  const [selectedFile, setSelectedFile] = useState();
  const [fileName, setFileName] = useState("");
  const [upload, setUpload] = useState(false);

  //adminList.map(names => (admins.push(names.name)))

  useEffect(() => {
    EditorComponent();
    console.log('editor component updated')
    // eslint-disable-next-line
  }, [count]);

  useEffect(() => {
    setInitalLength(faq.length)
    // eslint-disable-next-line
  }, [fetching]);

  useEffect(() => {
    checkMembers();
    // eslint-disable-next-line
  }, [faqPath]);

  useEffect(() => {
    OnlineStatus();
  }, [onlineUsers]);
  /*
    useEffect(() => {
      const time = 3000;
      const profile = auth.user;
      const body = `${profile.displayname}`
      const interval = setInterval(() => {
        sendStatus(time, profile, body)
      }, time);
      return () => clearInterval(interval);
    }, []);
  */
  const checkMembers = async () => {
    try {
      setAdmin('checking');
      const roomId = await matrixClient.getRoomIdForAlias(faqPath);
      const members = await matrixClient.getJoinedRoomMembers(roomId.room_id);
      console.log("members: " + JSON.stringify(members));
      setAdmin('admin');
    } catch (e) {
      console.log("error while checking members: " + e)
      setAdmin('error');
    }
  }

  const changeOrder = (pos, direction) => {
    faq.splice(pos + direction, 0, faq.splice(pos, 1).pop());
    setCount(count + 1)
  }

  const addEntry = () => {
    faq.splice(faq.length, 0, '');
    setCount(count + 1)
    console.log(faq.length)
  }
  const changeName = e => {
    e.preventDefault()
    setFileName(e.target.value)
  };

  const AddImage = () => {
    /*
    const uploadResponse = await matrixClient.uploadContent(imageResponse.data, { rawResponse: false, type: imageType });
    const matrixUrl = uploadResponse.content_uri;
    console.log(matrixUrl);
    const sendImageResponse = await matrixClient.sendImageMessage('!JIsalWHQCskeFGvtZs:synapse', matrixUrl, {}, '');
    console.log(sendImageResponse);
    */
    return (
      <>
        {selectedFile ? (
          <div>
            <p>Filename: <input type="text" value={fileName} onChange={changeName} /></p>
            <p>Type: {selectedFile.type}</p>
            <p>Size in bytes: {selectedFile.size}</p>
          </div>
        ) : (
            <p>Select a file to show details</p>
          )}
      </>)
  }

  const changeHandler = (event) => {
    setSelectedFile(event.target.files[0]);
    console.log(selectedFile)
    setFileName(event.target.files[0].name)
    //setIsFilePicked(true);
  };

  const handleSubmission = async () => {
    const roomId = await matrixClient.getRoomIdForAlias(faqPath);
    try {
      await matrixClient.uploadContent(selectedFile, { "name": fileName })
        .then((response) => matrixClient.mxcUrlToHttp(response))
        .then((url) => matrixClient.sendMessage(roomId.room_id, {
          "body": `= yaml =\norder: ${faq.length + 1}\neditor: "${localStorage.getItem("mx_user_id")}"\nimage: ${url}\n= yaml =\n![${fileName}](${url})`,
          "format": "org.matrix.custom.html",
          "msgtype": "m.text",
          "formatted_body": `= yaml =\norder: ${faq.length + 1}\neditor: "${localStorage.getItem("mx_user_id")}"\nimage: ${url}\n= yaml =\n`
        }))
        .then((res) => console.log(res))
      onSave()
      setFileName()
      setSelectedFile("")
      setUpload(false)
    } catch (e) {
      console.log("error while trying to save image: " + e)
    }

  };
  /*const createEditContent = (editedEvent, index) => {
  //for editing messages
    console.log("editsssss = " + editedEvent)

    const newContent = {
      "msgtype": "m.text",
      "body": `= yaml =\norder: ${index}\n= yaml =\n${localStorage.getItem(editedEvent)}`,
      "formatted_body": `= yaml =\norder: ${index}\n= yaml =\n${converter.makeHtml(localStorage.getItem(editedEvent))}`
    };

    const contentBody = {
      msgtype: newContent.msgtype,
      body: newContent.body,
      formatted_body: newContent.formatted_body,
    };

    return Object.assign({
      "m.new_content": newContent,
      "m.relates_to": {
        "rel_type": "m.replace",
        "event_id": editedEvent,
      },
    }, contentBody);
  }*/
  /*
    const sendStatus = async (time, profile, body) => {

      const roomId = await matrixClient.getRoomIdForAlias(faqPath);
      const allMessages = config.baseUrl + `/_matrix/client/r0/rooms/${roomId.room_id}/messages?limit=999999&access_token=${localStorage.getItem('mx_access_token')}&dir=b`
      const result = await fetch(allMessages)
      const data = await result.json();
      data.chunk.map(type => {
        if (type.type === "m.room.message" && type.content.body !== undefined && type.content.body.includes(body)) {
          console.log("updating online status")
          matrixClient.redactEvent(roomId.room_id, type.event_id, null, { 'reason': 'Updating status' })
        }
        if (type.type === "m.room.message" && type.content.body !== undefined && type.content.body.includes("was online")) {
          if (type.age <= time + 2000 && onlineUsers.includes(type.content.body.substr(0, type.content.body.indexOf(' '))) === false) onlineUsers.push(type.content.body.substr(0, type.content.body.indexOf(' ')))
          else if (type.age > time + 2000) {
            const index = onlineUsers.indexOf(`${type.content.body.substr(0, type.content.body.indexOf(' '))}`)
            matrixClient.redactEvent(roomId.room_id, type.event_id, null, { 'reason': 'Updating status' })
            onlineUsers.splice(index, 1)
          }

        }
      }
      )
      //await matrixClient.redactEvent(roomId.room_id, entry.event, null, { 'reason': 'I have my reasons!' })
      await matrixClient.sendMessage(roomId.room_id, {
        "body": body + " was online",
        "format": "org.matrix.custom.html",
        "msgtype": "m.text",
      })
      console.log("new status sent")
      console.log(onlineUsers)

      //set Online users
    }
  */

  const saveMessage = async (index, room, body) => {
    const html = converter.makeHtml(body)
    const img = html.includes('<img')
    const imgLink = html.substring(html.indexOf(`alt=\"`), html.indexOf(`\"`))
    const formattedBody = img ? `= yaml =\norder: ${index}\neditor: "${localStorage.getItem("mx_user_id")}"\nimage: ${imgLink}\n= yaml =\n${html}` : `= yaml =\norder: ${index}\neditor: "${localStorage.getItem("mx_user_id")}"\n= yaml =\n${html}`
    await matrixClient.sendMessage(room, {
      "body": `= yaml =\norder: ${index}\neditor: "${localStorage.getItem("mx_user_id")}"\n= yaml =\n${body}`,
      "format": "org.matrix.custom.html",
      "msgtype": "m.text",
      "formatted_body": formattedBody
    })
    onSave()
  }
  const saveAll = async (eventId, redact, pos) => {
    setLoading(true);
    const roomId = await matrixClient.getRoomIdForAlias(faqPath);
    try {
      if (redact) {
        try {
          await matrixClient.redactEvent(roomId.room_id, eventId, null, { 'reason': 'I have my reasons!' })
          faq.splice(pos, 1)
          console.log("redaction happened")
          //onSave()
          console.log(faq)
        } catch (e) {
          console.log("error while trying to edit: ")
        }
      }
      faq.forEach(async (entry, index) => {
        if (entry.order !== index && localStorage.getItem(entry.event) === null) {
          console.log("order changed")
          try {
            await matrixClient.redactEvent(roomId.room_id, entry.event, null, { 'reason': 'I have my reasons!' })
            console.log(entry.event + " was deleted")
            saveMessage(index, roomId.room_id, entry.body);
            //onSave()
          } catch (e) {
            console.log("error while trying to edit: ")
          }
        } else if (localStorage.getItem(entry.event) !== null) {
          console.log("body changed")
          try {
            await matrixClient.redactEvent(roomId.room_id, entry.event, null, { 'reason': 'I have my reasons!' })
            saveMessage(index, roomId.room_id, localStorage.getItem(entry.event))
            localStorage.removeItem(entry.event)
            //onSave()
          } catch (e) {
            console.log("error while trying to edit: ")
          }
        }
        onSave()
      })

    } catch (e) {
      console.log("error while trying to save" + e)
    }
    finally {

      console.log("yo done")
    }
    setLoading(false);
  }
  /*
    const saveChanges = async (index, eventId, order, redact) => {
      const roomId = await matrixClient.getRoomIdForAlias(faqPath);
      if (redact) {
        try {
          await matrixClient.redactEvent(roomId.room_id, eventId, null, { 'reason': 'I have my reasons!' })
          onSave()
          console.log(faq)
        } catch (e) {
          console.log("error while trying to edit: ")
        }
      }
      else {
        if (eventId !== undefined) {
          console.log("The times are a-changing")
          const editContent = createEditContent(eventId, index);
          try {
            await matrixClient.sendMessage(roomId.room_id, {
              "body": `= yaml =\norder: ${index}\n= yaml =\n${localStorage.getItem(eventId)}`,
              "format": "org.matrix.custom.html",
              "msgtype": "m.text",
              "formatted_body": `= yaml =\norder: ${index}\n= yaml =\n${converter.makeHtml(localStorage.getItem(eventId))}`
            })
            await matrixClient.redactEvent(roomId.room_id, eventId, null, { 'reason': 'I have my reasons!' })
            localStorage.removeItem(eventId)
            onSave()
          } catch (e) {
            console.log("error while trying to edit: ")
          }
        } else {
          try {
            await matrixClient.sendMessage(roomId.room_id, {
              "body": `= yaml =\norder: ${index}\n= yaml =\n${localStorage.getItem(eventId)}`,
              "format": "org.matrix.custom.html",
              "msgtype": "m.text",
              "formatted_body": `= yaml =\norder: ${index}\n= yaml =\n${converter.makeHtml(localStorage.getItem(eventId))}`
            })
            onSave()
            setCount(count + 1)
            localStorage.removeItem(eventId)
          } catch (e) {
            console.log('error while saving: ' + e)
          }
        }
      }
    }
    */

  const EditorComponent = () => {
    return (
      <>
        { faq.map((entry, index) => (
          <>
            <Editor
              defaultValue={entry.body}
              onChange={debounce((value) => {
                const text = value();
                localStorage.setItem(entry.event, text);
              }, 250)}
              key={entry.eventId} />
            {index !== 0 && <button key={'up' + index} onClick={() => changeOrder(index, -1)}>UP</button>}
            {index < faq.length - 1 && <button key={'down' + index} onClick={() => changeOrder(index, 1)}>DOWN</button>}
            <button key={'save' + index} onClick={() => saveAll(entry.event, false, index)}>Save Changes</button>
            <button key={'delete' + index} onClick={() => saveAll(entry.event, true, index)}>Delete Entry</button>
            <hr />
          </>
        ))}

      </>
    )
  }
  const OnlineStatus = () => {
    return (
      onlineUsers ? onlineUsers.map(user => <u>{user} is currently also online!</u>) : null
    )
  }

  return (

    admin === 'admin' ? (
      <section className="admin">
        <h2>Edit FAQ</h2>
        {fetching || loading ? <Loading /> : <EditorComponent />}
        <button onClick={() => addEntry()} disabled={initalLength !== faq.length}>ADD NEW ENTRY</button>

        <button onClick={() => setUpload(upload => !upload)} disabled={initalLength !== faq.length}>ADD IMAGE</button>
        {upload ? (
          <div>
            <input type="file" name="filename" onChange={changeHandler} disabled={initalLength !== faq.length} />
            {AddImage()}
            <div>
              <button onClick={handleSubmission}>Upload</button>
            </div>
          </div>)
          : null}
      </section>
    ) : admin === 'checking' ?
        <>
          <p>checking yo priviliges</p>
          <Loading />
        </> :
        <p>Sorry, heute nicht.</p>
  )

}
export default Admin


