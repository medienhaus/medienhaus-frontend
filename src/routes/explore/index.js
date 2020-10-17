import React, { useEffect, useState, useContext } from 'react';
import { AuthContext } from '../../components/context/AuthStatus'
import { Loading } from "../../components/loading/loading";
import roomStructure from "../../data/exploreList.json"
import PublicRooms from "../../components/matrix_public_rooms"
import * as matrixcs from "matrix-js-sdk";


const myUserId = localStorage.getItem("mx_user_id");
const myAccessToken = localStorage.getItem("mx_access_token");
const matrixClient = matrixcs.createClient({
  baseUrl: "https://medienhaus.udk-berlin.de",
  accessToken: myAccessToken,
  userId: myUserId
});

const Explore = () => {
  const [auth, setAuth] = useContext(AuthContext);
  const [joinedRooms, setJoinedRooms] = useState([]);
  const [joinId, setJoinId] = useState("");
  const [leaveId, setLeaveId] = useState("");
  const [update, setUpdate] = useState(false);
  const [loading, setLoading] = useState(true);
  const publicRooms = PublicRooms();

  setAuth(localStorage.getItem('cr_auth'))
  //first let's fetch all rooms our user is part of
  const getJoinedRooms = async () => {
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
    setLoading(false);
  }

  useEffect(() => {
    setLoading(true);
    getJoinedRooms();
    setUpdate(false);
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

  const RoomStructure = () => {
    return (
      roomStructure.map(data => (
        <RoomList faculty={data.faculty} displayName={data.displayName} />
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
    <section className="explore">
      {publicRooms.length === 0 ? <Loading /> : <RoomStructure />}
    </section>

  );
}

export default Explore;
