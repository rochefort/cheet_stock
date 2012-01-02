require 'spec_helper'

describe "key_mappings/show.html.erb" do
  before(:each) do
    @key_mapping = assign(:key_mapping, stub_model(KeyMapping,
      :key => "Key",
      :content => "Content",
      :ordinal => 1
    ))
  end

  it "renders attributes in <p>" do
    render
    # Run the generator again with the --webrat flag if you want to use webrat matchers
    rendered.should match(/Key/)
    # Run the generator again with the --webrat flag if you want to use webrat matchers
    rendered.should match(/Content/)
    # Run the generator again with the --webrat flag if you want to use webrat matchers
    rendered.should match(/1/)
  end
end
