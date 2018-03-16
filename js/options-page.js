/**
 * Main File for Options page
 * @version 1.0
 * @package Dark Night Mode
 */
jQuery(document).ready(function($) {
    /**
    * This function runs a notifcation for success, error ,warning
    * @param {string} text The message to show in notification
    * @param {string} id Unique notification id
    * @param {string} type Whether a success|error|warning notification
    * @param {string} posn Position of the notification box on screen
    *
    * @return void.
    */
    function dc_rn(text,options) {
        var options = $.extend({},{
            id  : 'yamc-notification',
            type: 'error',
            posn: 'bottomRight'
        },options);
        if (! text) {
            text    = 'We had an error processing your request. Please try again';
        }
        new Noty({
            type: options.type,
            layout: options.posn,
            theme: 'mint',
            text: text,
            timeout: 5000,
            progressBar: true,
            closeWith: ['click', 'button'],
            id: options.id
        }).show();
    }
    //Variables and function
    var $main       = $('#dnmo-ocp-toggler'),
        $list       = $main.find('#dnmo-listed-whitelist-websites-list'),
        dnmo_main   = {
        /**
         * Get whitelist li content
         * @param {object} name . The name of site
         *
         * @return {string} html string of li content
         */
        get_whitelist_li_content: function (name) {
            var content = '';
            content += '<li data-key="'+name+'" class="dnmo-lw-li">';
            content +=  '<span>'+name+'</span>';
            content +=  '<span class="wl-delete">Delete</span>';
            content += '</li>';
            return content;
        },
        /**
        * Append whitelist urls on page load
        *
        * @return void
        */
        set_whitelist_on_load: function () {
            var $this   = this,
                content = '',
                count   = 0;
            chrome.storage.local.get({'whitelist':{}},(data) => {
                for (var site_name in data.whitelist) {
                    content += this.get_whitelist_li_content(site_name);
                    count++;
                }
                $list.append(content);
                $main.find('#dnmo-wl-count').text(count);
            });
        },
        /**
         * Save chrome options data
         * @param {object} data The data object to save
         *
         * @return void
         */
        save_option_data: function (data) {
            return chrome.storage.local.set(data);
        },
        /**
         * Process whitelist data and saveit
         *
         * @return void
         */
        save_whitelist_data: function () {
            var data = {};
            $list.find('li').each(function(index, el) {
                data[$(this).attr('data-key')] = true;
            });
            var resp = this.save_option_data({'whitelist':data});

            dc_rn('Options saved successfully',{
                type: 'success'
            });
        }
    }
    dnmo_main.set_whitelist_on_load();
    $('body').on('click', '#dnmo-save-whitelist-list', function() {
        dnmo_main.save_whitelist_data()
    });
    $('body').on('click', '.wl-delete', function() {
        $(this).closest('li').slideUp(400,function() {
            $(this).remove();
        });
        var $ccount = $main.find('#dnmo-wl-count'),
            count = parseInt($ccount.text()) - 1;
        $ccount.text(count);
    });
});
