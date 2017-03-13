import React from 'react';
import ReactDOM from 'react-dom';
import TestUtils from 'react-addons-test-utils';
import { UserManager, NewUser } from '../components/UserManager';
import { shallow } from 'enzyme';

import { userData } from '../data/users';
import { groupData } from '../data/groups';

describe('UserManager', () => {
    var userManager, groupsLink;

    beforeEach(() => {
        userManager = shallow(<UserManager users={userData} groups={groupData}/>),
        groupsLink = userManager.find('nav a').last();
    });

    it('changes heading when navigating to groups', () => {
        /* should start with a 'Users heading' */
        expect(userManager.find('h2').text()).toEqual(expect.stringContaining('Users'));
        groupsLink.simulate('click');
        expect(userManager.find('h2').text()).toEqual(expect.stringContaining('Groups'));
    });

    it('displays the correct number of table entries', () => {
        /* there's 1000 users and 50 groups in our data so the heading should reflect that: */
        expect(userManager.find('h2').text()).toEqual(expect.stringContaining('1000'));
        groupsLink.simulate('click');
        expect(userManager.find('h2').text()).toEqual(expect.stringContaining('50'));
    });

});

describe('NewUser', () => {

    it('saves the proper output', () => {
        const saveFn = (model) => {
            expect(model.get('name')).toEqual('Test User');
            expect(model.get('email')).toEqual('test@test.com');
            expect(model.get('gender')).toEqual('Female');
        }
        const newUser = shallow(<NewUser id={1} save={saveFn}/>),
              saveLink = newUser.find('a');

        newUser.setState({
            name: 'Test User',
            email: 'test@test.com',
            gender: 'Female'
        });
        saveLink.simulate('click');
    });

});