import { useRouterHistory } from 'react-router';
import { createHashHistory } from 'history';
import store from '../store';

const history = useRouterHistory(createHashHistory)({ queryKey: false });

history.listen((location) => {
	// Do stuff as needed.
});

export default history;
