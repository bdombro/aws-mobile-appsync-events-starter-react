import React, {Fragment} from "react";
import {Link} from "react-router-dom";
import {useQuery, useMutation} from 'react-apollo-hooks';
import gql from "graphql-tag";

import QueryAllEvents from "../GraphQL/QueryAllEvents";
import MutationDeleteEvent from "../GraphQL/MutationDeleteEvent";

import moment from "moment";

const RenderEvent = ({event}) => {
    const deleteEvent = useMutation(gql(`
        mutation($id: ID!) {
          deleteEvent(id: $id) {
            id
            name
            where
            when
            description
            comments {
              items {
                commentId
              }
            }
          }
        }`),
        {
            variables: { id: event.id },
        }
    );
    const handleDeleteClick = async (e) => {
        e.preventDefault();
        if (window.confirm(`Are you sure you want to delete event ${event.id}`)) {
            await deleteEvent(event);
        }
    };

    return (
        <Link to={`/event/${event.id}`} className="card" key={event.id}>
            <div className="content">
                <div className="header">{event.name}</div>
            </div>
            <div className="content">
                <p><i className="icon calendar"></i>{moment(event.when).format('LL')}</p>
                <p><i className="icon clock"></i>{moment(event.when).format('LT')}</p>
                <p><i className="icon marker"></i>{event.where}</p>
            </div>
            <div className="content">
                <div className="description"><i className="icon info circle"></i>{event.description}</div>
            </div>
            <div className="extra content">
                <i className="icon comment"></i> {event.comments.items.length} comments
            </div>
            <button className="ui bottom attached button" onClick={handleDeleteClick.bind(this)}>
                <i className="trash icon"></i>
                Delete
            </button>
        </Link>
    )
};

export const AllEvents = () => {
    const busy = false;
    const {data, error} = useQuery(gql(`
        query {
          listEvents(limit: 1000) {
            items {
              id
              name
              where
              when
              description
              comments {
                items {
                  commentId
                }
              }
            }
          }
        }`));
    if (error) return `Error! ${error.message}`;

    const handleSync = () => null;

    const handleDeleteClick = async (event, e) => {
        e.preventDefault();

        if (window.confirm(`Are you sure you want to delete event ${event.id}`)) {
            const {deleteEvent} = this.props;

            await deleteEvent(event);
        }
    };



    return (
        <div>
            <div className="ui clearing basic segment">
                <h1 className="ui header left floated">All Events Hooks</h1>
                <button className="ui icon left basic button" onClick={handleSync} disabled={busy}>
                    <i aria-hidden="true" className={`refresh icon ${busy && "loading"}`}></i>
                    Sync with Server
                </button>
            </div>
            <div className="ui link cards">
                <div className="card blue">
                    <Link to="/newEvent" className="new-event content center aligned">
                        <i className="icon add massive"></i>
                        <p>Create new event</p>
                    </Link>
                </div>
                {data.listEvents.items.map(event => <RenderEvent key={event.id} event={event}/>)}
            </div>
        </div>
    );


};
export default AllEvents;