import Link from 'next/link'

function splitColour(button) {
	if(button.on) {
		return <a style={{"font-weight":"bold"}} style={{"textDecoration":"underline"}}>{button.name}</a>
	} else {
		return <a style={{color:"white"}}>{button.name}</a>
	}
}

const NavButton = ({ button }) => (
	<li>
		<Link href={`/${button.id}`}>
			{splitColour(button)}
		</Link>
		<style jsx global>{`
			li a {
			    display: block;
			    color: white;
			    text-align: left;
			    padding: 20px;
			    text-decoration: none;
			    font-family: Arial;
			}

			li a:hover:not(.active) {
			    background-color: #111;
			}

		`}</style>
	</li>
)


const SideNav = (props) => (
	<div>
		<ul>
			{props.config.map((item) => (
        		<NavButton key={item.id} button={item}/>
      		))}
		</ul>
		<div className="contents">
			{props.children}
		</div>
		<style jsx>{`
			ul {
				top: 69px;
				list-style-type: none;
				background-color: #404040;
    			width: 200px;
    			height: 100%;
    			margin: 0px;
    			padding: 0px;
    			position: fixed;
    			overflow: auto;
    			box-shadow: 0px 0px 8px #888888;
			}

			.contents {
				margin-left: 200px;
			}
		`}</style>
	</div>
)

export default SideNav