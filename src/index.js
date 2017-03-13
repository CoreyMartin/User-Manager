import React from 'react';
import ReactDOM from 'react-dom';
import { AppContainer } from 'react-hot-loader';
import { UserManager } from './components/UserManager';

import { userData } from './data/users';
import { groupData } from './data/groups';

const render = (Component) => {
  ReactDOM.render(
        <AppContainer>
            <Component users={userData} groups={groupData}/>
        </AppContainer>,
        document.getElementsByTagName('main')[0]
    );
};

render(UserManager);

if (module.hot) {
    module.hot.accept('./components/UserManager', () => {
        render(UserManager)
    });
}