import Header from '../components/Header'

const Layout = (props) => (
	<Header name={props.name}>
		{props.children}
		<style jsx global>{`
      		body { 
        		background: #d9d9d9;
        		margin: 0;
      		}
		`}</style>
	</Header>
)

export default Layout