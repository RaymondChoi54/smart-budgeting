import Layout from '../components/Layout'
import SideNav from '../components/SideNav'

const LayoutBar = (props) => (
	<Layout name={props.name}>
		<SideNav config={props.config}>
			{props.children}
		</SideNav>
	</Layout>
)

export default LayoutBar