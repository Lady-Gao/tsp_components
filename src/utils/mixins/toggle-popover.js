export default {
    methods: {
        /**
         * 显示popover气泡框
         * @param {Object} popover=this.$refs['popover'] 
         * @param {Element} target=作用的元素 
         */
        mixins_showPopover(popover, target) {
            popover.referenceElm = target;
            
            popover.$refs.popper.style.display = 'none';
            popover.doDestroy();    
            popover.showPopper = true;
        },

        mixins_hidePopover(popover) {
            popover.showPopper = false;
        },

        /**
         * 提示框的显示
         * @param {*} tooltip: 提示框的实例化 
         * @param {*} target： event.target 
         */
        mixins_showTooltip(tooltip, target) {  
            tooltip.referenceElm = target;
            tooltip.$refs.popper.style.display = 'none';
            tooltip.doDestroy();
            tooltip.setExpectedState(true);
            tooltip.handleShowPopper();	
        },

        mixins_ellipsisShowTooltip(target, tooltip) {
            if(target.scrollWidth > target.offsetWidth) {
                this.mixins_showTooltip(tooltip, target);
            };

            return target.innerText;
        },

        mixins_hideTooltip(tooltip) {
            if(tooltip) {
                tooltip.setExpectedState(false);
                tooltip.handleClosePopper();
            }
        }
    }
}