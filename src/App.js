import React, { Component } from 'react';
import KonamiStarWars from './konami-star-wars';
import logo from './logo.svg';
import './App.css';

class App extends Component {
    render() {
        return (
            <div className='app'>
                <header className='app-header'>
                    <img src={logo} className='app-logo' alt='logo' />
                    <h1 className='app-title'>Welcome to React</h1>
                </header>
                <p className='app-intro'>To get started, edit <code>src/App.js</code> and save to reload.</p>
                <KonamiStarWars />
            </div>
        );
    }
}

export default App;
