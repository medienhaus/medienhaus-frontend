import React, { useEffect, useState } from 'react';
import { Loading } from "../../components/loading/loading";
import { useHistory } from 'react-router-dom'
import roomStructure from "../../data/exploreList.json"
import PublicRooms from "../../components/matrix_public_rooms"
import * as matrixcs from "matrix-js-sdk";


const myUserId = localStorage.getItem("mx_user_id");
const myAccessToken = localStorage.getItem("mx_access_token");
const matrixClient = matrixcs.createClient({
  baseUrl: "https://medienhaus.udk-berlin.de",
  accessToken: myAccessToken,
  userId: myUserId,
  useAuthorizationHeader: true
});

const Explore = () => {
  const [joinedRooms, setJoinedRooms] = useState([]);
  const [joinId, setJoinId] = useState("");
  const [leaveId, setLeaveId] = useState("");
  const [update, setUpdate] = useState(false);
  const [loading, setLoading] = useState(true);
  const publicRooms = PublicRooms();
  const history = useHistory();

  //first let's fetch all rooms our user is part of
  const getJoinedRooms = async () => {
    try {
      const answer = await matrixClient.getJoinedRooms();
      const getNames = await Promise.all(answer.joined_rooms.map(async (roomId) => {
        try {
          const room = await matrixClient.getStateEvent(roomId, "m.room.name");
          if (room.name !== "") {
            return room.name;
          } else {
            return "[[ Untitled Chat ]]";
          }
        } catch (error) {
          return "[[ Private Chat ]]";
        }
      }));
      setJoinedRooms(getNames);
    } catch (e) {
      if (e.data.error === "Invalid macaroon passed.") {
        history.push('/login')
      } else if (e.data.error === "Unrecognised access token") {
        alert("Oops something went wrong! Please try loggin in again")
        localStorage.clear();
        history.push('/login');
      }

      console.log(e.data.error);

    }
    setLoading(false);
  }

  useEffect(() => {
    setLoading(true);
    getJoinedRooms();
    setUpdate(false);
    // eslint-disable-next-line
  }, [update])

  useEffect(() => {
    matrixClient.leave(leaveId)
      .then(() => setUpdate(true))
      .catch((e) => {
        console.log("thrown error because leavId can't be empty")
      }
      );
    setLeaveId("");
  }, [leaveId])

  useEffect(() => {
    matrixClient.joinRoom(joinId)
      .then(() => setUpdate(true))
      .catch((e) => {
        console.log("thrown error because joinId can't be empty")
      }
      );
    setJoinId("");
  }, [joinId])

  const NotLogged = () => {
    history.push('/login');
    return (<p>
      you are being redirected to the login page
    </p>)
  }

  const RoomStructure = () => {
    return (
      roomStructure.map(data => (
        <RoomList faculty={data.faculty} displayName={data.displayName} key={data.id} />
      ))
    )
  }

  //component
  const RoomList = ({ faculty, displayName }) => {
    return (
      <>
        <h2>{displayName}</h2>
        {[...publicRooms].sort().map(publicRoom => (
          publicRoom.name.startsWith(`${faculty}`) ? (
            <div className="explore" key={publicRoom.room_id}>
              {publicRoom.avatar_url ? <img className="avatar" src={matrixClient.mxcUrlToHttp(publicRoom.avatar_url, 100, 100, "crop", false)} alt="avatar" /> : <canvas className="avatar" style={{ backgroundColor: 'black' }}></canvas>}
              <label htmlFor={publicRoom.room_id} key={publicRoom.name} name={faculty}>{publicRoom.name}</label>
              {joinedRooms.includes(publicRoom.name) ? <button onClick={() => setLeaveId(publicRoom.room_id)} name="Leave">{loading ? <Loading /> : "Leave"}</button> : <button onClick={() => setJoinId(publicRoom.room_id)} name="Join">{loading ? <Loading /> : "Join"}</button>}
            </div>
          ) : (
              null
            )
        )
        )
        }
      </>
    )
  }

  return (
    localStorage.getItem('mx_access_token') ? (
      <section className="explore">
        {publicRooms.length === 0 ? <Loading /> : <RoomStructure />}
      </section>
    ) : (
        <NotLogged />
      )

  );
}

export default Explore;
