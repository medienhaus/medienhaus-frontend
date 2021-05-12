import React from 'react'
import { Loading } from '../../components/loading'
import roomStructure from '../../assets/data/naming.json'
import federation from '../../assets/data/federation.json'
import { withTranslation } from 'react-i18next'
import Matrix from '../../Matrix'
import PropTypes from 'prop-types'
import AdvancedJoinForm from './advancedJoinForm'
import { map, uniq, filter, keyBy, pickBy } from 'lodash-es'
import RoomList from './roomList'

class Explore extends React.Component {
  constructor (props) {
    super(props)

    this.state = {
      publicRooms: {},
      joinedRooms: {},
      search: '',
      loading: false,
      advancedJoinFormLoading: false,
      showAdvanced: false,
      federationServer: '',
      federationServerPublicRooms: {}
    }

    this.matrixClient = Matrix.getMatrixClient()

    this.leaveRoom = this.leaveRoom.bind(this)
    this.joinRoom = this.joinRoom.bind(this)
    this.setFederationServer = this.setFederationServer.bind(this)
  }

  componentDidMount () {
    this.fetchPublicRooms()
    this.fetchJoinedRooms()
  }

  async fetchPublicRooms () {
    const publicRooms = (await this.matrixClient.publicRooms()).chunk
    this.setState({ publicRooms: keyBy(publicRooms, 'room_id') })
  }

  joinRoom (roomId) {
    return this.matrixClient.joinRoom(roomId)
      .then(async () => {
        this.setState((previousState) => {
          const joinedRooms = previousState.joinedRooms
          joinedRooms[roomId] = previousState.publicRooms[roomId].name

          return {
            joinedRooms: joinedRooms
          }
        })
      })
      .catch((e) => {
        e.data.error === ' was not legal room ID or room alias' ? console.log('ID or Alias empty, taking a rest.') : e.data.error === 'Too Many Requests' ? alert(this.props.t('Slow Down! You\'re a bit too quick there')) : console.log(e.data.error)
      })
  }

  leaveRoom (roomId) {
    return this.matrixClient.leave(roomId)
      .then(() => {
        this.setState((previousState) => {
          const joinedRooms = previousState.joinedRooms
          delete joinedRooms[roomId]

          return {
            joinedRooms: joinedRooms
          }
        })
      })
      .catch((e) => {
        e.data.error === ' was not legal room ID or room alias' ? console.log('ID or Alias empty, taking a rest.') : e.data.error === 'Too Many Requests' ? alert(this.props.t('Slow Down! You\'re a bit too quick there')) : console.log(e.data.error)
      })
  }

  // Fetching all rooms a user has already joined and replacing private rooms with generic names
  async fetchJoinedRooms () {
    const joinedRoomsWithNames = {}

    const response = await this.matrixClient.getJoinedRooms()
    await Promise.all(response.joined_rooms.map(async (roomId) => {
      try {
        const room = await this.matrixClient.getStateEvent(roomId, 'm.room.name')
        if (room.name !== '') {
          joinedRoomsWithNames[roomId] = room.name
        } else {
          joinedRoomsWithNames[roomId] = '[[ Untyped Chat ]]'
        }
      } catch (error) {
        joinedRoomsWithNames[roomId] = '[[ Private Chat ]]'
      }
    }))

    this.setState({ joinedRooms: joinedRoomsWithNames })
  }

  setFederationServer (e) {
    const server = e.target.value

    // Unset the federation server, and display our base server's rooms
    if (!server) {
      this.setState({ federationServer: '' })
      return
    }

    // Select a different server we want to federate with
    this.setState({ loading: true })

    this.matrixClient.publicRooms({
      server: server,
      limit: 50
    }).then((resp) => {
      this.setState({ federationServer: server, federationServerPublicRooms: keyBy(resp.chunk, 'room_id') })
    }).finally(() => {
      this.setState({ loading: false })
    })
  }

  submitAdvancedJoinForm ({ advancedRoom, advancedServer }) {
    this.setState({ advancedJoinFormLoading: true })
    return this.matrixClient.joinRoom(`#${advancedRoom}:${advancedServer}`)
      .then(() => alert(this.props.t('Joined room successfully')))
      .catch((e) => {
        e.data.error === ' was not legal room ID or room alias' ? alert('ID or Alias empty.') : e.data.error === 'Too Many Requests' ? alert(this.props.t('Slow Down! You\'re a bit too quick there')) : alert(e.data.error)
      })
      .then(async () => await this.fetchJoinedRooms())
      .finally(() => {
        this.setState({
          showAdvanced: false,
          advancedJoinFormLoading: false
        })
      })
  }

  render () {
    const t = this.props.t
    const {
      search,
      loading,
      advancedJoinFormLoading,
      showAdvanced,
      federationServer
    } = this.state
    let {
      publicRooms,
      federationServerPublicRooms
    } = this.state

    // Show our loading spinner if we're still waiting for results
    if (loading) return <Loading />

    // If we have an active search going on, filter our search results before rendering them
    if (search) {
      publicRooms = pickBy(publicRooms, room => room.name.includes(search.toLowerCase().replace(/ /g, '')))
      federationServerPublicRooms = pickBy(federationServerPublicRooms, room => room.name.includes(search.toLowerCase().replace(/ /g, '')))
    }

    return (
      <section className="explore">
        <form id="server">
          <div id="toolbar">
            <input name="search" type="text" value={search} onChange={(e) => this.setState({ search: e.target.value })} placeholder="search …"/>
            {/* eslint-disable-next-line jsx-a11y/no-onchange */}
            <select
              name="federations"
              id="federations"
              onChange={this.setFederationServer}
              value={federationServer}
            >
              <option value="">{process.env.REACT_APP_MATRIX_BASE_ALIAS}</option>
              {federation.map((fed, index) => (
                <option key={index} name={fed.server} id={index} value={fed.server}>{fed.name}</option>
              ))}
            </select>
          </div>
          <div>
            {/* eslint-disable-next-line jsx-a11y/click-events-have-key-events,jsx-a11y/no-noninteractive-element-interactions */}
            <label onClick={() => this.setState({ showAdvanced: !showAdvanced })}>{showAdvanced ? '×' : '+'} {t('Advanced options')}</label>
          </div>
        </form>
        {showAdvanced && (<AdvancedJoinForm submit={this.submitAdvancedJoinForm.bind(this)} loading={advancedJoinFormLoading} />)}

        {/* If we have selected a different server we want to federate with, then show its rooms */}
        {
          federationServer && federationServerPublicRooms && (<>
            <h2>{federationServer}</h2>
            <RoomList
              roomsToList={federationServerPublicRooms}
              joinedRooms={this.state.joinedRooms}
              onJoinRoom={this.joinRoom}
              onLeaveRoom={this.leaveRoom}
            />
          </>)
        }

        {/* If we have an active search going on, we just list our base server's public rooms if there are any... */}
        {
          (search && Object.keys(publicRooms).length > 0) && (<>
            <h2>{process.env.REACT_APP_MATRIX_BASE_ALIAS}</h2>
            <RoomList
              roomsToList={publicRooms}
              joinedRooms={this.state.joinedRooms}
              onJoinRoom={this.joinRoom}
              onLeaveRoom={this.leaveRoom}
            />
          </>)
        }

        {/* ... but if there's no active search we display our base server's public rooms in specific sections: */}
        {/* the filtering logic is very specific to our use case and will most likely need some changes before using it in different scenarios */}
        {/* we map through all public rooms and check if those rooms start with a certain prefix defined in /src/assets/data/naming.json */}
        {
          (!federationServer && !search) && uniq(map(roomStructure, 'type')).map(type => [
            // Title for each "type" section
            <h2 key={type} style={{ textTransform: 'capitalize' }}>{type}</h2>,
            // All rooms of the given type
            filter(roomStructure, { type: type }).map((section) => [
              <h3 key={`h3${section.faculty}`}>{section.displayName}</h3>,
              <RoomList
                key={`roomList${section.faculty}`}
                roomsToList={pickBy(publicRooms, room => (
                  room.name.startsWith(`${section.faculty}-`) ||
                  room.name.startsWith(`${section.faculty}+vk-`) ||
                  room.name.startsWith(`kum+${section.faculty}-`)
                ))}
                joinedRooms={this.state.joinedRooms}
                onJoinRoom={this.joinRoom}
                onLeaveRoom={this.leaveRoom}
              />
            ])
          ])
        }
      </section>
    )
  }
}

Explore.propTypes = {
  t: PropTypes.func.isRequired
}

export default withTranslation('explore')(Explore)
