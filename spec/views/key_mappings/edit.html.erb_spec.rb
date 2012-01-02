require 'spec_helper'

describe "key_mappings/edit.html.erb" do
  before(:each) do
    @key_mapping = assign(:key_mapping, stub_model(KeyMapping,
      :key => "MyString",
      :content => "MyString",
      :ordinal => 1
    ))
  end

  it "renders the edit key_mapping form" do
    render

    # Run the generator again with the --webrat flag if you want to use webrat matchers
    assert_select "form", :action => key_mappings_path(@key_mapping), :method => "post" do
      assert_select "input#key_mapping_key", :name => "key_mapping[key]"
      assert_select "input#key_mapping_content", :name => "key_mapping[content]"
      assert_select "input#key_mapping_ordinal", :name => "key_mapping[ordinal]"
    end
  end
end
