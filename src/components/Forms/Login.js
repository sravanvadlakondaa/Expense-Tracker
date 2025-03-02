import React, { Component } from 'react';
import './Login.css';
import fire from '../../config/Fire';

class Login extends Component {

    state = {
        email: '',
        password: '',
        fireErrors: ''
    }

    login = e => {
        e.preventDefault();
        fire.auth().signInWithEmailAndPassword(this.state.email, this.state.password)
        .catch((error) => {
            this.setState({fireErrors: error.message})
        });
    }

    handleChange = e => {
        this.setState({[e.target.name]: e.target.value});
    }

    render () {

        let errorNotification = this.state.fireErrors ?
            (<div className='Error'>{this.state.fireErrors}</div>) :
            null;
    
        return (
            <>

                {errorNotification}
                <form>

                    <input type="text" 
                        className="regField"
                        placeholder="Email"
                        value={this.state.email}
                        onChange={this.handleChange}
                        name="email" />

                    <input type="password" 
                        className="regField"
                        placeholder="Password"
                        value={this.state.password}
                        onChange={this.handleChange}
                        name="password" />
                    
                    <input type="submit"
                        onClick={this.login}
                        className="submitBtn"
                        value="ENTER" />

                </form>
            </>
        )
    }

}

export default Login;