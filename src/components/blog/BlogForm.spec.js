import {assert} from 'chai';
import {mount} from 'enzyme';
import sinon from 'sinon';
import React from 'react';
import BlogForm from './BlogForm';
import history from '../../history';

describe('Test the BlogForm component', function() {

  let stub;

  beforeEach(() => {
    stub = sinon.stub(history, 'replace');
  });
  
  afterEach(() => {
    history.replace.restore();
  });

  it('should replace the url if the user is not authenticated', function() {
    mount(<BlogForm />, { context: { user: null }});
    assert.isTrue(stub.called);
  });
	
  it('should render the component if the user is authenticated', function() {
    const wrapper = mount(<BlogForm />, { context: { user: { id: 42 }}});
    assert.isFalse(stub.called);
    assert.lengthOf(wrapper.find('[data-cmp="BlogForm"]'), 1);
  });
	
});
