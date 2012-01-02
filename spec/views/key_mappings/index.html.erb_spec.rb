require 'spec_helper'

describe "key_mappings/index.html.erb" do
  before(:each) do
    assign(:key_mappings, [
      stub_model(KeyMapping,
        :key => "Key",
        :content => "Content",
        :ordinal => 1
      ),
      stub_model(KeyMapping,
        :key => "Key",
        :content => "Content",
        :ordinal => 1
      )
    ])
  end

  it "renders a list of key_mappings" do
    render
    # Run the generator again with the --webrat flag if you want to use webrat matchers
    assert_select "tr>td", :text => "Key".to_s, :count => 2
    # Run the generator again with the --webrat flag if you want to use webrat matchers
    assert_select "tr>td", :text => "Content".to_s, :count => 2
    # Run the generator again with the --webrat flag if you want to use webrat matchers
    assert_select "tr>td", :text => 1.to_s, :count => 2
  end
end
