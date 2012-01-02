require "spec_helper"

describe KeyMappingsController do
  describe "routing" do

    it "routes to #index" do
      get("/key_mappings").should route_to("key_mappings#index")
    end

    it "routes to #new" do
      get("/key_mappings/new").should route_to("key_mappings#new")
    end

    it "routes to #show" do
      get("/key_mappings/1").should route_to("key_mappings#show", :id => "1")
    end

    it "routes to #edit" do
      get("/key_mappings/1/edit").should route_to("key_mappings#edit", :id => "1")
    end

    it "routes to #create" do
      post("/key_mappings").should route_to("key_mappings#create")
    end

    it "routes to #update" do
      put("/key_mappings/1").should route_to("key_mappings#update", :id => "1")
    end

    it "routes to #destroy" do
      delete("/key_mappings/1").should route_to("key_mappings#destroy", :id => "1")
    end

  end
end
