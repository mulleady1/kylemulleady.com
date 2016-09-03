import {assert} from 'chai';
import {shallow} from 'enzyme';
import React from 'react';
import {App} from './App';

describe('Test the root App component', function() {

  const props = {
    user: null
  };

  it('should render the app', function() {
    const wrapper = shallow(<App {...props} />);
    assert.lengthOf(wrapper.find('[data-cmp="App"]'), 1);
  });
	
});
