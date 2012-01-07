class GroupsController < ApplicationController
  def reorder
    params[:group].each_with_index{|row, i| Group.update(row, {:ordinal => i + 1})}
    render :nothing => true
  end

  def index
    @groups = Group.all
    respond_to do |format|
      format.html
      format.json { render json: @groups }
    end
  end

  def show
    @group = Group.find(params[:id])
  end

  def new
    @group = Group.new
  end

  def edit
    @group = Group.find(params[:id])
  end

  def create
    @group = Group.new(params[:group])
    if request.xhr?
      @group.ordinal = Group.next_ordinal
      @group.key_mappings.build({key: '', content: '', ordinal: 1})
      if @group.save
        logger.info { @group.key_mappings }
        status = 'success'
        html = render_to_string partial: 'sheets/group', locals: { group: @group }
      else
        status = 'error'
      end
      render action: 'sheets/index', json: { status: status, data: @group, html: html}
      return
    end
    
    if @group.save
      redirect_to @group, notice: 'Group was successfully created.'
    else
      render action: "new"
    end
  end

  def update
    @group = Group.find(params[:id])
    if request.xhr?
      if @group.update_attributes(params[:group])
        status = 'success'
      else
        status = 'error'
      end
      render action: 'sheets/index', json: { status: status }
      return
    end
    
    if @group.update_attributes(params[:group])
      redirect_to @group, notice: 'Group was successfully updated.'
    else
      render action: "edit"
    end
  end

  def destroy    
    @group = Group.find(params[:id])
    @group.destroy

    redirect_to groups_url
  end
end
