require 'webrick'
require 'fileutils'

# Ensure assets directory exists for uploads
FileUtils.mkdir_p('assets')

server = WEBrick::HTTPServer.new(
  Port: 8000, 
  DocumentRoot: '.',
  MaxBodySize: 100 * 1024 * 1024 # 100MB limit for MP3s/PDFs
)

# Setup an /upload route to intercept and save files
server.mount_proc '/upload' do |req, res|
  if req.request_method == 'POST'
    file_data = req.query['file']
    if file_data && file_data.filename
      # Sanitize filename to avoid weird characters
      orig_name = file_data.filename.gsub(/[^a-zA-Z0-9_\.\-]/, '_')
      filename = "assets/#{orig_name}"
      
      # Write file to the /assets folder
      File.open(filename, "wb") do |f| 
        f.write(file_data.body) 
      end
      
      # Return the path so JS can populate the input box
      res.status = 200
      res.body = filename
    else
      res.status = 400
      res.body = "No file received"
    end
  else
    res.status = 405
    res.body = "Method Not Allowed"
  end
end

trap 'INT' do server.shutdown end

puts "\n"
puts "=================================================="
puts " Harvester Server Running at http://localhost:8000"
puts " File Uploads Enabled! Files save to /assets"
puts "=================================================="
puts "\n"

server.start
