import LayoutBar from '../components/LayoutBar'

const names = [
	{ id: 'dashboard', name: 'Dashboard', on: true},
	{ id: 'profile-settings', name: 'Profile & Settings', on: false},
	{ id: 'current-month', name: 'Current Month', on: false},
	{ id: 'history', name: 'History', on: false},
	{ id: 'logout', name: 'Logout', on: false}
];

const fullname = 'Raymond Choi';

export default () => (
	<LayoutBar config={names} name={fullname}>
		<p>This is the Dashboard</p>
		<style jsx>{`
			p {
				height: 1000px;
			}
		`}</style>
	</LayoutBar>
)
