# -*- mode: ruby -*-
# vi: set ft=ruby :
Vagrant.require_plugin "vagrant-exec"
Vagrant.require_plugin "vagrant-vbguest"

VAGRANTFILE_API_VERSION = "2"

Vagrant.configure(VAGRANTFILE_API_VERSION) do |config|
    config.vbguest.auto_update = true

    # do NOT download the iso file from a webserver
    config.vbguest.no_remote = false

    config.vm.provider "virtualbox" do |v|
        v.customize ["setextradata", :id, "VBoxInternal2/SharedFoldersEnableSymlinksCreate/vagrant", "1"]
        v.customize ["modifyvm", :id, "--memory", 2048]
    end

    config.vm.box = "nodejsGrasshopper_v0.1.0"
    config.vm.box_url = "https://s3.amazonaws.com/SolidInteractive/vagrant/grasshopper_nodejs_default_v0.1.1.box"

    config.vm.provision "shell", path: "startup.sh", privileged: false

    config.vm.network :forwarded_port, guest: 80, host: 8080, auto_correct: true
    config.vm.network :forwarded_port, guest: 5678, host: 8081, auto_correct: true
    config.vm.network :forwarded_port, guest: 27017, host: 8082, auto_correct: true
end
