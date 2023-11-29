const helper = require('./helper.js');
const React = require('react');
const ReactDOM = require('react-dom');

const handleDomo = (e) => {
    e.preventDefault();
    helper.hideError();

    const name = e.target.querySelector('#domoName').value;
    const age = e.target.querySelector('#domoAge').value;
    const skill = e.target.querySelector('#domoSkill').value;

    if (!name || !age || !skill) {
        helper.handleError('All fields are required!');
        return false;
    }

    helper.sendPost(e.target.action, {name, age, skill}, loadDomosFromServer);

    return false;
}

const DomoForm = (props) => {
    return (
        <form id="domoForm"
            onSubmit={handleDomo}
            name="domoForm"
            action="/maker"
            method="POST"
            className="domoForm"
        >
            <label htmlFor="name">Name: </label>
            <input type="text" id="domoName" name="name" placeholder="Domo Name"/>

            <label htmlFor="age">Age: </label>
            <input id="domoAge" type="number" min="0" name="age"/>
            
            <label htmlFor="skill">Skill: </label>
            <input id="domoSkill" type="number" min="0" name="skill"/>

            <input type="submit" className="makeDomoSubmit" value="Make Domo"/>
        </form>
    );
}

const DomoList = (props) => {
    if (props.domos.length === 0) {
        return (
            <div className="domoList">
                <h3 className="emptyDomo">No Domos Yet!</h3>
            </div>
        );
    }

    const domoNodes = props.domos.map(domo => {
        return (
            <div className="domo" key={domo._id}>
                <img src="/assets/img/domoface.jpeg" alt="domo face" className="domoFace" />
                <h3 className="domoName"> Name: {domo.name} </h3>
                <h3 className="domoAge"> Age: {domo.age} </h3>
                <h3 className="domoSkill"> Skill: {domo.skill} </h3>
            </div>
        );
    });

    return (
        <div className="domoList">
            {domoNodes}
        </div>
    );
}

const loadDomosFromServer = async () => {
    const response = await fetch('/getDomos');
    const data = await response.json();
    ReactDOM.render(
        <DomoList domos={data.domos} />,
        document.querySelector('#domos')
    );
}

const init = () => {
    ReactDOM.render(
        <DomoForm/>,
        document.querySelector('#makeDomo')
    );

    ReactDOM.render(
        <DomoList domos={[]}/>,
        document.querySelector('#domos')
    );

    loadDomosFromServer();
}

window.onload = init;