import React, { Component } from 'react';
import Konami from './konami';
import KonamiStarWars from './konami-star-wars';
import './App.css';

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            konami: false
        };
    }
    componentDidMount() {
        document.addEventListener('keyup', Konami.code(this.onSuccess.bind(this)));
    }

    onSuccess() {
        if (this.state.konami) {
            return;
        }

        KonamiStarWars();

        this.setState({
            konami: true
        })
    }

    render() {
        return (
            <div className='app'>
                <h1>↑ ↑ ↓ ↓ ← → ← → B A</h1>
            </div>
        );
    }
}

export default App;
