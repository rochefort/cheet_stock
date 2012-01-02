require 'test_helper'

class KeyMappingsControllerTest < ActionController::TestCase
  setup do
    @key_mapping = key_mappings(:one)
  end

  test "should get index" do
    get :index
    assert_response :success
    assert_not_nil assigns(:key_mappings)
  end

  test "should get new" do
    get :new
    assert_response :success
  end

  test "should create key_mapping" do
    assert_difference('KeyMapping.count') do
      post :create, key_mapping: @key_mapping.attributes
    end

    assert_redirected_to key_mapping_path(assigns(:key_mapping))
  end

  test "should show key_mapping" do
    get :show, id: @key_mapping.to_param
    assert_response :success
  end

  test "should get edit" do
    get :edit, id: @key_mapping.to_param
    assert_response :success
  end

  test "should update key_mapping" do
    put :update, id: @key_mapping.to_param, key_mapping: @key_mapping.attributes
    assert_redirected_to key_mapping_path(assigns(:key_mapping))
  end

  test "should destroy key_mapping" do
    assert_difference('KeyMapping.count', -1) do
      delete :destroy, id: @key_mapping.to_param
    end

    assert_redirected_to key_mappings_path
  end
end
