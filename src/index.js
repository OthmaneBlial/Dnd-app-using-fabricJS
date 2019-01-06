import React from 'react';
import ReactDOM from 'react-dom';
import { fabric } from 'fabric';

import './styles.css';

class App extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			canvas: null,
			mouseX: 0,
			mouseY: 0,
			selectedObjectId: '',
			selectedObject: null,
			showIconsBar: true,
			objectToBeConncted: false,
			titles: []
		};
	}

	onDrop(e) {
		e.preventDefault();
		const data = e.dataTransfer.getData('text');
		console.log(data);
		console.log('dropping');

		this.addObject(data);

		console.log('end dropping');
	}

	allowDrop(e) {
		e.preventDefault();
	}

	drag(e) {
		console.log('dragging');
		e.dataTransfer.setData('text', e.target.id);
		console.log(e.dataTransfer.getData('text'));
	}

	addObject(objectType, top = 100, left = 100, scaleX = 1, scaleY = 1) {
		const isCircleType = objectType === 'circle';
		const id = Date.now();

		const circle = new fabric.Circle({
			radius: 50,
			fill: '#0052d4',
			top,
			left,
			scaleX,
			scaleY,
			originX: 'center',
			id: `circle-${id}`
		});

		const rect = new fabric.Rect({
			left,
			top,
			scaleX,
			scaleY,
			originX: 'center',
			fill: '#0052d4',
			width: 130,
			height: 80,
			id: `rect-${id}`
		});

		isCircleType ? this.state.canvas.add(circle) : this.state.canvas.add(rect);

		const editableText = this.addEditableText(id, top, left, 'block');
		this.setState({
			titles: [ ...this.state.titles, editableText ]
		});
	}

	removeSelectedObject() {
		this.state.canvas.remove(this.state.canvas.getActiveObject());
		this.setState({
			showIconsBar: false
		});
	}

	changeTypeOfSelectedObject() {
		const selectedObject = this.state.selectedObject;
		const { left, top, id, scaleX, scaleY } = selectedObject;
		if (id.startsWith('circle')) {
			this.removeSelectedObject();
			this.addObject('rect', top, left, scaleX, scaleY);
		} else {
			this.removeSelectedObject();
			this.addObject('circle', top, left, scaleX, scaleY);
		}
	}

	getMouseCords(e) {
		document.getElementById('box').addEventListener('mousemove', (e) => {
			//console.log(e);
			this.setState({
				mouseX: e.pageX,
				mouseY: e.pageY
			});
		});
	}

	getIdOfSelectedObject() {
		const selectedObjectRendred = this.state.canvas.getActiveObject();
		if (selectedObjectRendred && selectedObjectRendred.id !== this.state.selectedObjectId) {
			this.setState({
				selectedObjectId: selectedObjectRendred.id,
				selectedObject: selectedObjectRendred
			});
		}
	}

	iconsBar(top, left) {
		return (
			<div
				id="iconsBar"
				style={{
					position: 'absolute',
					top: top || -500,
					left: left || -500
				}}
			>
				<i onClick={() => this.removeSelectedObject()} className="fa fa-trash-o" aria-hidden="true" />
				<i className="fa fa-magic" aria-hidden="true" />
				<i onClick={() => this.changeTypeOfSelectedObject()} className="fa fa-exchange" aria-hidden="true" />
				<i
					onClick={() => this.setObjectToBeConnected()}
					style={{ background: this.state.objectToBeConncted ? 'red' : '' }}
					className="fa fa-plug"
					aria-hidden="true"
				/>
			</div>
		);
	}

	showIconsBarOnSelectedObject() {
		if (this.state.canvas.getActiveObject()) {
			if (!this.state.showIconsBar) {
				this.setState({
					showIconsBar: true
				});
			}
		}
	}

	addLine() {
		const line = new fabric.Line([ 50, 100, 200, 200 ], {
			left: 170,
			top: 150,
			stroke: 'red'
		});
		this.state.canvas.add(line);
	}

	setObjectToBeConnected() {
		this.setState({
			objectToBeConncted: true
		});
	}

	addEditableText(id, top, left, display) {
		return (
			<p
				contentEditable
				id={id}
				style={{
					position: 'absolute',
					top,
					left,
					display
				}}
			>
				Enter a Title here...
			</p>
		);
	}

	componentDidMount() {
		const canvas = new fabric.Canvas('c');
		canvas.setHeight(2000);
		canvas.setWidth(2000);
		canvas.renderAll();
		this.setState({
			canvas
		});
	}

	componentDidUpdate() {
		//console.log(this.state.selectedObjectId);
		//console.log(this.state.canvas.getActiveObject() && this.state.canvas.getActiveObject().id);
		this.getIdOfSelectedObject();
		this.showIconsBarOnSelectedObject();
		//console.log(this.state);
		//console.log(this.getMouseCords());
		//console.log(this.state.canvas.getActiveObject());
	}

	render() {
		const selectedObject = this.state.selectedObject;
		let top = 0;
		let left = 0;
		if (selectedObject) {
			top = selectedObject.top + 50;
			left = selectedObject.left - 60;
		}

		return (
			<div className="container">
				<header>
					<button onClick={() => this.addLine()}>Add Line</button>
					<ul className="elements">
						<li className="element">
							<span onDragStart={(e) => this.drag(e)} draggable="true" className="rect" id="rect" />
						</li>
						<li className="element">
							<span onDragStart={(e) => this.drag(e)} draggable="true" className="circle" id="circle" />
						</li>
						<li className="element">
							<span onDragStart={(e) => this.drag(e)} draggable="true" className="line" id="line" />
						</li>
					</ul>
				</header>
				<div
					onClick={(event) => this.getMouseCords(event)}
					id="box"
					className="box"
					onDrop={(e) => this.onDrop(e)}
					onDragOver={(e) => this.allowDrop(e)}
				>
					{this.state.showIconsBar && this.iconsBar(top, left)}
					{JSON.stringify('hi')}
					<canvas id="c" width="100%" height="100%" />
				</div>
			</div>
		);
	}
}

const rootElement = document.getElementById('root');
ReactDOM.render(<App />, rootElement);
