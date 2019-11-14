/**
 * ocx方法混合，仅适用于公司开发的ocx插件。
 * @description 使用顺序：先初始化控件（使用ocxInit方法），然后再调用其它方法。
 */

export default {
  methods: {
    /**
     * 初始化OCX控件
     * @param {String} poster ：需要初始化的object 实例id
     * @param {Object} options ：初始化设置的ip跟端口{ipAddress：''，port:'',userLevel:'',replayPower:'',picCutPower:'',ytCtrlPower:'',MTpowerPower:''}
     */
    ocxInit(poster, options) {
      poster.SetServerInfo(
        options.ipAddress,
        options.port,
        options.userLevel,
        options.replayPower,
        options.picCutPower,
        options.ytCtrlPower,
        options.MTpowerPower
      );
    },

    /**
     * 播放实时视频
     * @param {String} poster :需要播放的object 实例id
     * @param {Object} options :播放实时视频的相关信息，sim卡，通道号，码流类型 {simCode:'',channel:'',StreamType:''}
     */
    ocxRealtimePlay(poster, options) {
      poster.StartRealTimeVideo(
        options.simCode,
        options.channel,
        options.StreamType,
        options.hasAudio
      );
    },

    /**
     * 播放实时视频
     * @param {String} poster :需要播放的object 实例id
     * @param {Object} options :播放实时视频的相关信息，sim卡，通道号，码流类型 {simCode:'',channel:'',StreamType:''}
     */
    ocxRealtimePlayXY(poster, options) {
      poster.StartRealTimeVideoProtocolStandard(
        options.simCode,
        options.channel,
        options.dataType,
        options.StreamType
      );
    },

    /**
     * 回放播放
     * @param {String} poster: 需要回放视频的object 实例id
     * @param {Object} options ：回放相关信息 {simCode:车辆sim卡号，channel：通道号，MediaType：音视频类型，StreamType：码流类型，StorageType：存储器类型，PlaybackMode：回放方式，Multiple：快退/快进，StartTime：开始时间，EndTime：结束时间}
     */
    ocxReplay(poster, options) {
      poster.PlayBack_Utc(
        options.simCode,
        options.channel,
        options.MediaType,
        options.StreamType,
        options.StorageType,
        options.PlaybackMode,
        options.Multiple,
        options.StartTime,
        options.EndTime,
        options.DataSource
      );
    },

    /**
     * 关闭视频
     * @param {String} poster：需要关闭的object 实例id
     */
    ocxCloseVideo(poster) {
      poster.StopAll();
    },

    /**
     * 开启双向对讲
     * @param {String} poster：需要开启的object 实例id
     * @param {Object} options :播放实时视频的相关信息，sim卡，通道号，码流类型 {simCode:'',channel:'',StreamType:''}
     */
    ocxSpeaking(poster, options) {
      poster.StartRTSpeaking(
        options.simCode.options.channel,
        options.StreamType
      );
    },

    /**
     * 关闭双向对讲
     * @param {String} poster：需要关闭的object 实例id
     */
    ocxStopSpeaking(poster) {
      poster.StopRTSpeaking();
    },

    /**
     * 开启监听
     * @param {String} poster：需要开启的object 实例id
     * @param {Object} options :播放实时视频的相关信息，sim卡，通道号，码流类型 {simCode:'',channel:'',StreamType:''}
     */
    ocxMonitor(poster, options) {
      poster.StartMonitorVoice(
        options.simCode.options.channel,
        options.StreamType
      );
    },

    /**
     * 关闭监听
     * @param {String} poster：需要关闭的object 实例id
     */
    ocxStopMonitor(poster) {
      poster.StopMonitorVoice();
    }
  }
};
