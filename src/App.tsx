import React from 'react';
import logo from './logo.svg';
import './App.css';

import { Document, WebIO } from '@gltf-transform/core';
import { prune, textureResize, dedup, quantize, weld } from '@gltf-transform/functions';
const io = new WebIO();

async function preprocessMesh(buffer: ArrayBuffer, mime_type: string): Promise<Uint8Array> {
    let document: Document;
    const uint8view = new Uint8Array(buffer);
    if (mime_type === "model/gltf-binary") {
        document = await io.readBinary(uint8view);
    } else {
        const textEnc = new TextDecoder("utf-8");
        const json = JSON.parse(textEnc.decode(uint8view));
        document = await io.readJSON({json: json, resources: {}});
    }

    await document.transform(
        prune(),
        dedup(),
        quantize(),
        weld(),
        textureResize({size: [512, 512]})
    );

    return io.writeBinary(document);
}

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.tsx</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;
