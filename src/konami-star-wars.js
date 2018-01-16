import Explosions from './explosions2';
import Konami from './konami';
import KonamiCanvas from './konami-canvas';
import React, { Component } from 'react';

class KonamiStarWars extends Component {
    constructor(props) {
        super(props);

        this.canvas;
        this.state = {
            enabled: false,
        }
    }

    componentDidMount() {
        document.addEventListener('keyup', Konami.code(this.onSuccess.bind(this)));
        this.onSuccess();
    }

    onSuccess() {
        if (this.state.enabled) {
            return;
        }

        KonamiCanvas();

        this.setState({
            enabled: true
        });
    }

    render() {
        const { enabled } = this.state;

        return (
            <div><canvas /></div>
        );
    }
}

export default KonamiStarWars;
