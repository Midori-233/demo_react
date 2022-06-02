import React, {Component} from "react";

import UserService from "../services/user.service";
import EventBus from "../common/EventBus";
import AuthService from "../services/auth.service";
import {Redirect} from "react-router-dom";
import Form from "react-validation/build/form";
import Input from "react-validation/build/input";

function getAllUser(json) {
    let rows = ""
    rows += `
      <tr>
      	<td>${"code:"}</td>
      	<td>${json.code}</td>
        </tr>
        <tr>
        <td>${"msg:"}</td>
      	<td>${json.msg}</td>
        </tr>
        <tr>
        <td>${"data:"}</td>
      	<td>${"id"}</td>
      	<td>${"name"}</td>
      	<td>${"age"}</td>
      	<td>${"passwd"}</td>
        </tr>
    `
    for(const js of json.data) {
        rows += `
            <tr>
             <td>${""}</td>
      	     <td>${js.id}</td>
      	     <td>${js.name}</td>
      	     <td>${js.age}</td>
      	     <td>${js.passwd}</td>
            </tr>
        `
    }
    return `<table>${rows}</table>`;
}

export default class BoardUser extends Component {
    constructor(props) {
        super(props);

        this.state = {
            msg: "",
            content: "",
            redirect: null,
            userReady: false,
            currentUser: {username: ""},
            input: {username: "", age: "", id: ""}
        };
    }

    componentDidMount() {
        const currentUser = AuthService.getCurrentUser();
        UserService.getUserBoard().then(
            response => {
                this.setState({
                    content: response.data,
                    currentUser: currentUser,
                    userReady: true
                });
            },
            error => {
                this.setState({
                    content:
                        (error.response &&
                            error.response.data &&
                            error.response.data.message) ||
                        error.message ||
                        error.toString()
                });

                if (error.response && error.response.status === 401) {
                    EventBus.dispatch("logout");
                }
            }
        );
    }
    render() {
        if (this.state.redirect) {
            return <Redirect to={this.state.redirect}/>
        }
        const {currentUser} = this.state;
        return (
            <div>
                <header >
                    <h1>User:{currentUser.username}</h1>
                </header>
                <div >
                    <div >
                        <Form>
                            <div>
                                <label htmlFor="username">Id</label>
                                <Input
                                    type="text"
                                    className="form-control"
                                    name="id"
                                    value={this.state.input.id}
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="username">Username</label>
                                <Input
                                    type="Username"
                                    className="form-control"
                                    name="username"
                                    value={this.state.input.username}
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="age">Age</label>
                                <Input
                                    type="Age"
                                    className="form-control"
                                    name="age"
                                    value={this.state.input.age}
                                />
                            </div>

                            <div>
                                <button
                                    onClick={function () {
                                        /*
                                        * TODO
                                        * FIXME
                                        * */
                                        /*document.querySelector("#table").innerHTML =
                                            getAllUser(UserService.getAllUser())*/
                                        this.setState({
                                            msg:UserService.getAllUser()
                                        })
                                        }
                                    }
                                >
                                    <span>Search</span>
                                </button>
                            </div>
                            <div id="table">{this.state.msg}</div>
                        </Form>
                    </div>
                </div>
            </div>
        );
    }
}
