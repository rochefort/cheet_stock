class GroupsController < ApplicationController
  before_filter :find_group, :only => [:show, :edit, :update, :destroy]
  def reorder
    params[:group].each_with_index{|row, i| Group.update(row, {ordinal: i + 1})}
    render :nothing => true
  end

  def index
    @groups = Group.all
  end

  def show
  end

  def new
    @group = Group.new
  end

  def edit
  end

  def create
    @group = Group.new(params[:group])
    if request.xhr?
      @group.ordinal = Group.next_ordinal
      @group.key_mappings.build({key: '', content: '', ordinal: 1})
    end
    
    status = @group.save
    if request.xhr?
      xhr_response_render_json(status) do
        html = render_to_string partial: 'shared/group', collection: [@group]
        {html: html}
      end
      return
    end

    if status
      redirect_to @group, notice: 'Group was successfully created.'
    else
      render action: "new"
    end
  end

  def update
    status = @group.update_attributes(params[:group])
    xhr_response_render_json(status) and return if request.xhr?

    if status
      redirect_to @group, notice: 'Group was successfully updated.'
    else
      render action: "edit"
    end
  end

  def destroy
    status = @group.destroy
    xhr_response_render_json(status) and return if request.xhr?
    redirect_to groups_url
  end
  
  private
  def find_group
    @group = Group.find(params[:id])
  end
end
