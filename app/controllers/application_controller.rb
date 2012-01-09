class ApplicationController < ActionController::Base
  protect_from_forgery
  
  private
  def xhr_response_render_json(status)
    msg = (status)? 'success' : 'error'
    hash = { status: msg }
    hash.merge!(yield) if block_given?
    render json: hash
  end
end
