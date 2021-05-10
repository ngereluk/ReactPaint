import './App.css';
import React, { useState } from 'react';
import { CompactPicker } from 'react-color';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter, Tooltip } from 'reactstrap';
import 'bootstrap/dist/css/bootstrap.min.css'
import pencilIcon from './images/pencil.png'
import fillIcon from './images/paint-bucket.png'
import trashIcon from './images/trash.png'
import canvasSize from './images/full-screen.png'
import paintIcon from './images/paintIcon.png'

const defaultGrid = createBlankGrid(10, 20)
const defaultColour = "#035afc";

function App() {

  const [grid, setGrid] = useState(defaultGrid);
  const [pencilSelect, setPencilSelect] = useState(false);
  const [fillSelect, setFillSelect] = useState(false);
  const [isCanOpen, setModalisCanOpen] = useState(false);
  const [heightInput, setHeight] = useState(20);
  const [widthInput, setWidth] = useState(10);
  const [background, setBackground] = useState(defaultColour);
  const [isError, setErrorisVis] = useState(false);

  return (
    <div style={{ height: "100vh", width: "100%", display: "flex", flexDirection: "column" }}>
      <div style={{
        margin: "10px",
        boxShadow: "1px 1px",
        backgroundColor: "#bdbdbd"
      }}
        class="shadow p-3 bg-body rounded">
        <div

          style={{
            paddingBottom: "10px",
          }}>React Paint<img style={{ marginLeft: "10px" }} src={paintIcon} /></div>
        <div style={{ display: "flex", flexDirection: "row", alignItems: 'flex-start' }}>

          { /*Pencil button*/}
          <div color="primary" style={{ marginBottom: "3px", marginRight: "10px", border: pencilSelect ? "3px solid blue" : "3px solid white" }} onClick={() => { setPencilSelect(!pencilSelect); setFillSelect(false) }}>
            <img src={pencilIcon} />
          </div>{' '}

          { /*Spill tool button*/}
          <div color="primary" style={{ marginBottom: "3px", marginRight: "10px", border: fillSelect ? "3px solid blue" : "3px solid white" }} onClick={() => { setFillSelect(!fillSelect); setPencilSelect(false) }}> <img src={fillIcon} /></div>{' '}

          { /*Canvas size button and modal*/}
          <div color="primary" style={{ marginBottom: "3px", marginRight: "10px", border: "3px solid white" }} onClick={() => { setModalisCanOpen(!isCanOpen) }}><img src={canvasSize} /></div>{' '}
          <Modal isOpen={isCanOpen}>
            <ModalHeader toggle={console.log()}>Canvas Dimensions</ModalHeader>
            <ModalBody>
              <div style={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center"
              }}>
                <div>
                  Please enter the canvas dimensions in pixels
              </div>
                <div>
                  <div style={{ padding: "4px 4px" }}>
                    <label style={{ paddingRight: "4px" }}>
                      Height:{" "}
                      <input type="text" value={heightInput} onChange={(event) => { setHeight(event.target.value) }} /> px
              </label>
                  </div>
                  <div style={{ padding: "4px 4px" }}>
                    <label>
                      Width:{" "}
                      <input type="text" value={widthInput} onChange={(event) => { setWidth(event.target.value); }} /> px
              </label>
                    <div style={{
                      color: "red",
                      visibility: isError ? "visible" : "hidden"
                    }}>
                      The height and/or width cannot be zero or negative. Please enter a positive, no zero value in both fields</div>
                  </div>
                </div>
              </div>
            </ModalBody>
            <ModalFooter>
              <Button color="primary" onClick={() => { (widthInput <= 0 || heightInput <= 0) ? setErrorisVis(true) : setModalisCanOpen(!isCanOpen); setGrid(createBlankGrid(widthInput, heightInput)) }}>Done</Button>{' '}
              <Button color="secondary" disabled="isError" onClick={() => { setModalisCanOpen(!isCanOpen) }}>Cancel</Button>
            </ModalFooter>
          </Modal>

          {/*Clear Canvas button*/}
          <div color="primary" style={{ marginBottom: "3px", marginRight: "10px", border: "3px solid white" }} onClick={() => { setGrid(createBlankGrid(widthInput, heightInput)) }}><img src={trashIcon} style={{ height: "32px", width: "32px" }} /></div>{' '}
          <div style={{ marginLeft: "8px" }}>
            <CompactPicker color={background}
              onChangeComplete={color => setBackground(color)} />
          </div>
        </div>
      </div>
      <div style={{ display: "flex", marginLeft: "10px", marginRight: "10px", marginBottom: '10px', flexGrow: "1", }}
        class="shadow p-3 bg-body rounded"
      >

        <div
          className={(!pencilSelect && !fillSelect) ? "pointer" : pencilSelect ? "paint" : "fill"}
          style={{
            flexGrow: "1",
            width: '100%',
            display: "flex",
            flexDirection: "column",
            backgroundColor: "grey"
          }}>
          {grid.map((row, h) => {
            return <div key={h} style={{
              display: "flex",
              flexDirection: "row",
              width: "100%",
              flexGrow: "1",
              alignItems: "stretch"
            }}>
              {row.map((x, w) => {
                return <div key={w} style={{
                  flexGrow: "1",
                  backgroundColor: x,
                  margin: "1px",
                }}
                  onClick={() => {
                    if (fillSelect) {
                      console.log("fill")
                      setGrid(floodFill(grid, h, w, background))
                      return;
                    }
                    if (pencilSelect) {
                      console.log("pencil - background", background)
                      setGrid(pencilToolFunc(grid, h, w, background));

                    }
                    else {
                      return;
                    }

                  }}>

                </div>
              })}
            </div>
          })}
        </div>
      </div>
    </div>
  );
}

export default App;


function createBlankGrid(h, w) {
  console.log("create grid runs, height", h, "width", w)
  const grid = Array.from({ length: h }, () => Array.from({ length: w }, () => "white"))
  console.log("the new grid", grid)
  return grid
}


function pencilToolFunc(grid, h, w, colour) {
  let copy = [...grid];
  copy[h][w] = colour.hex;
  return copy;
}


const floodFill = (grid, w, h, newColor) => {
  //Get the input which needs to be replaced.
  newColor = newColor.hex
  const current = grid[w][h];

  //If the newColor is same as the existing 
  //Then return the original image.
  if (current === newColor) {
    let copy = [...grid];
    return copy;
  }

  //Other wise call the fill function which will fill in the existing image.
  fill(grid, w, h, newColor, current);
  //Return the image once it is filled
  let copy = [...grid];
  return copy;
};

const fill = (grid, w, h, newColor, oldColour) => {
  //If row is less than 0

  if (w < 0) {
    return;
  }

  //If column is less than 0
  if (h < 0) {
    return;
  }

  //If row is greater than image length
  if (w > grid.length - 1) {
    return;
  }

  //If column is greater than image length
  if (w > grid[w].length - 1) {
    return;
  }

  //If the current pixel is not which needs to be replaced
  if (grid[w][h] !== oldColour) {
    return;
  }

  //Update the new color
  grid[w][h] = newColor;

  //Fill in all four directions
  //Fill Prev row
  fill(grid, w - 1, h, newColor, oldColour);

  //Fill Next row
  fill(grid, w + 1, h, newColor, oldColour);

  //Fill Prev col
  fill(grid, w, h - 1, newColor, oldColour);

  //Fill next col
  fill(grid, w, h + 1, newColor, oldColour);

}


