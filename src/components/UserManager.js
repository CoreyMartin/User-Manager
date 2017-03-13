import React from 'react';
import $ from 'jquery';
import Backbone from 'backbone';

const userHeaders = ['ID', 'User name', 'Email', 'Gender', 'Groups'],
      groupHeaders = ['ID', 'Group name', 'Users', 'Total users'];
      
export class UserManager extends React.Component {
    constructor(props) {
        super(props);

        var users = new Backbone.Collection(props.users),
            groups = new Backbone.Collection(props.groups);

        /* create backbone collections from existing user/group associations: */
        users.forEach((user, i) => {
            user.set({groups: new Backbone.Collection(user.get('groups'))})
        })
        groups.forEach((group, i) => {
            group.set({users: new Backbone.Collection(group.get('users'))})
        })

        this.state = {
            heading: 'Users',
            users: users,
            groups: groups,
            headers: userHeaders,
            addingUser: false,
            page: 'users'
        }
        this.state.models = this.state.users;

        /* sort users in reverse order so we can easily see when one is added */
        this.state.users.comparator = user => -user.get('id');
        this.state.users.sort();

        /* easy access from console */
        window.manager = this;
    }

    /* go to the main users list page */
    goToUsers = (heading) => {
        this.setState({
            heading: 'Users',
            page: 'users',
            models: this.state.users,
            headers: userHeaders,
            addingUser: false
        });
    }

    /* go to the main groups list page */
    goToGroups = () => {
        this.setState({
            heading: 'Groups',
            page: 'groups',
            models: this.state.groups,
            headers: groupHeaders,
            addingUser: false
        });
    }

    /* go to an individual group page */
    goToGroupList = (groupId) => {
        var group = this.state.groups.get(groupId);
        this.setState({
            heading: `Users in ${group.get('name')}`,
            page: 'group',
            models: group.get('users'),
            currentGroup: group,
            headers: userHeaders,
            addingUser: false
        })
    }

    /* adds user to all users */
    addUser = (model) => {
        this.state.users.add(model);
        this.setState({ addingUser: false });
    }

    /* adds user to individual group */
    addUserToGroup = (userId) => {
        var user = this.state.users.get(userId);
        this.state.models.add(user);
        user.attributes.groups.add(this.state.currentGroup);
        this.setState({ addingUser: false });
    }

    remove = (model) => {
        this.state.models.remove(model);
        this.forceUpdate();
    }

    render() {
        var headers, rows = [],
            allGroupsPage = (this.state.page === 'groups'),
            allUsersPage = (this.state.page === 'users'),
            groupUsersPage = (this.state.page === 'group'),
            addingUser = this.state.addingUser,
            addButton = null;

        this.state.models.forEach((model, i) => {
            if (allUsersPage || groupUsersPage) {
                rows.push(<UserRow key={i} model={model} delete={() => this.remove(model)}/>);
            } else if (allGroupsPage) {
                rows.push(<GroupRow key={i} model={model} delete={() => this.remove(model)} edit={() => this.goToGroupList(model.id)}/>);
            }
        });

        if (allUsersPage || groupUsersPage) {
            addButton = (<a onClick={() => this.setState({ addingUser: true })}>Add User</a>);
        }

        return (
            <div>
                <header>
                    <h1>User Manager</h1>
                    <nav>
                        <a onClick={this.goToUsers}>Users</a>
                        <a onClick={this.goToGroups}>Groups</a>
                    </nav>
                </header>
                <div id="wrapper">
                    <h2>{this.state.heading} {addButton} <span>displaying {this.state.models.length}</span></h2>
                    <table>
                        <thead>
                            <Headers headers={this.state.headers} edit={allGroupsPage ? true : false}/>
                        </thead>
                        <tbody>
                            {groupUsersPage && addingUser ? <AddUserToGroup users={this.state.users} addToGroup={this.addUserToGroup}/> : null}
                            {allUsersPage && addingUser ? <NewUser id={this.state.users.length + 1} save={this.addUser}/> : null}
                            {rows}
                        </tbody>
                    </table>
                </div>
            </div>
        )
    }
}

class Headers extends React.Component {
    render() {
        var headers = [];

        this.props.headers.forEach(function(header, i){
            const className = header.toLowerCase().replace(/\s/g, '-');
            headers.push(<td className={className} key={i}>{header}</td>);
        });

        return (
            <tr>
                {headers}
                {this.props.edit ? <td className="header-edit">Edit</td> : null}
                <td className="header-delete">Delete</td>
            </tr>
        )
    }
}

class UserRow extends React.Component {
    render() {
        var groups = []; 

        this.props.model.get('groups').forEach((group, i) => {
            groups.push([group.get('name')]);
        })
        return (
            <tr>
                <td>{this.props.model.get('id')}</td>
                <td>{this.props.model.get('name')}</td>
                <td>{this.props.model.get('email')}</td>
                <td>{this.props.model.get('gender')}</td>
                <td>{groups.join(', ')}</td>
                <td><a onClick={this.props.delete}>Delete</a></td>
            </tr>
        )
    }
}

class GroupRow extends React.Component {
    render() {
        var users = []; 

        this.props.model.get('users').forEach((user, i) => {
            users.push([user.get('name')]);
        })
        return (
            <tr>
                <td>{this.props.model.get('id')}</td>
                <td>{this.props.model.get('name')}</td>
                <td>{users.join(', ')}</td>
                <td>{users.length}</td>
                {this.props.edit ? <td><a onClick={this.props.edit}>Edit</a></td> : null}
                <td><a onClick={this.props.delete}>Delete</a></td>
            </tr>
        )
    }
}

class AddUserToGroup extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            value: 'default'
        }
    }

    handleClick = (event) => {
        this.props.addToGroup(this.state.value)
    }

    render() {
        var options = [];

        this.props.users.forEach((user, i) => {
            options.push(<option key={i} value={user.get('id')}>{user.get('name')}</option>);
        })
        return (
            <tr>
                <td><a onClick={this.handleClick}>Done</a></td>
                <td>
                    <select value={this.state.value} onChange={ event => this.setState({value: event.target.value}) }>
                        <option value='default'></option>
                        {options}
                    </select>
                </td>
            </tr>
        )
    }
}

export class NewUser extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            name: '',
            email: '',
            gender: ''
        }
    }

    save = () => {
        var model = new Backbone.Model(this.state);
        model.set({ 
            id: this.props.id,
            groups: []
        });
        this.props.save(model);
    }

    render() {
        return (
            <tr>
                <td><a onClick={this.save}>Done</a></td>
                <td><input value={this.state.name} onChange={event => this.setState({'name': event.target.value}) }/></td>
                <td><input value={this.state.email} onChange={event => this.setState({'email': event.target.value}) }/></td>
                <td><input value={this.state.gender} onChange={event => this.setState({'gender': event.target.value}) }/></td>
            </tr>
        )
    }
}