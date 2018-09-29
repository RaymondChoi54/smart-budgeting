const Window = (props) => (
	<div className="window">
		<div className="bar">{props.barName}</div>
	    {props.children}
		<style jsx>{`
			.bar {
				background: black;
				color: white;
				padding: 8px;
				border-radius: 1px;
				text-align: left;
			}

			.window {
				text-align: center;
				background: rgba(254, 254, 254, 0.8);
				box-shadow: 0px 0px 4px #888888;
				width: 100%;
				display: block;
			}
		`}</style>

	</div>
)

export default Window