import React, { Component } from 'react';
import './Application.css';

import { withAuthenticator } from 'aws-amplify-react';
import { Storage } from 'aws-amplify';

Storage.configure({ level: 'private' });

class S3Image extends Component {
    state = { src: null };

    async componentDidMount() {
        const src = await Storage.get(this.props.s3key, { expires: 10 });
        this.setState((state, props) => ({ ...state, src }));
    }

    render() {

        if (!this.state.src)
            return null;

        return (
            <article>
                <img
                    key={Math.random()}
                    src={this.state.src}
                    alt=""
                    onClick={ this.props.handleRemove }
                />
            </article>
        );
    }
}

class Application extends Component {
    state = {
        files: []
    };

    async componentDidMount() {
        const files = await Storage.list('');
        this.setState((state, props) => ({ ...state, files }));
    }

    handleSubmit = event => {
        event.preventDefault();

        const file = this.fileInput.files[0];
        const { name } = file;

        Storage.put(name, file)
            .then(res =>
                this.setState((state, props) => ({ files: [...state.files, res] }))
            );
    };

    handleRemove = (fileKey) => (event) => {
        event.preventDefault();
        const files = this.state.files.filter((file) => file.key !== fileKey);

        Storage.remove(fileKey)
            .then(() => this.setState((state, props) => ({ files })));
    };

    render() {
        return (
            <div className="Application">
                <form className="NewItem" onSubmit={this.handleSubmit}>
                    <input
                        type="file"
                        ref={input => this.fileInput = input}
                    />
                    <input className="full-width" type="submit"/>
                </form>
                <section className="Application-images">
                    {
                        this.state.files.map((s3item) => (
                            <S3Image key={s3item.key} s3key={s3item.key} handleRemove={this.handleRemove(s3item.key)}/>)
                        )
                    }
                </section>
            </div>
        );
    }
}

export default withAuthenticator(Application);
