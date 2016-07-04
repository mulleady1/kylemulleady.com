import { useRouterHistory } from 'react-router';
import { createHashHistory } from 'history';
import store from './redux/store';

const appHistory = useRouterHistory(createHashHistory)({ queryKey: false });

appHistory.listen((location) => {
	// Do stuff as needed.
});

export default appHistory;
