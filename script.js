(function(){
    var script = {
 "scripts": {
  "historyGoBack": function(playList){  var history = this.get('data')['history'][playList.get('id')]; if(history != undefined) { history.back(); } },
  "setPanoramaCameraWithCurrentSpot": function(playListItem){  var currentPlayer = this.getActivePlayerWithViewer(this.MainViewer); if(currentPlayer == undefined){ return; } var playerClass = currentPlayer.get('class'); if(playerClass != 'PanoramaPlayer' && playerClass != 'Video360Player'){ return; } var fromMedia = currentPlayer.get('panorama'); if(fromMedia == undefined) { fromMedia = currentPlayer.get('video'); } var panorama = playListItem.get('media'); var newCamera = this.cloneCamera(playListItem.get('camera')); this.setCameraSameSpotAsMedia(newCamera, fromMedia); this.startPanoramaWithCamera(panorama, newCamera); },
  "setPanoramaCameraWithSpot": function(playListItem, yaw, pitch){  var panorama = playListItem.get('media'); var newCamera = this.cloneCamera(playListItem.get('camera')); var initialPosition = newCamera.get('initialPosition'); initialPosition.set('yaw', yaw); initialPosition.set('pitch', pitch); this.startPanoramaWithCamera(panorama, newCamera); },
  "getGlobalAudio": function(audio){  var audios = window.currentGlobalAudios; if(audios != undefined && audio.get('id') in audios){ audio = audios[audio.get('id')]; } return audio; },
  "getMediaFromPlayer": function(player){  switch(player.get('class')){ case 'PanoramaPlayer': return player.get('panorama') || player.get('video'); case 'VideoPlayer': case 'Video360Player': return player.get('video'); case 'PhotoAlbumPlayer': return player.get('photoAlbum'); case 'MapPlayer': return player.get('map'); } },
  "updateMediaLabelFromPlayList": function(playList, htmlText, playListItemStopToDispose){  var changeFunction = function(){ var index = playList.get('selectedIndex'); if(index >= 0){ var beginFunction = function(){ playListItem.unbind('begin', beginFunction); setMediaLabel(index); }; var setMediaLabel = function(index){ var media = playListItem.get('media'); var text = media.get('data'); if(!text) text = media.get('label'); setHtml(text); }; var setHtml = function(text){ if(text !== undefined) { htmlText.set('html', '<div style=\"text-align:left\"><SPAN STYLE=\"color:#FFFFFF;font-size:12px;font-family:Verdana\"><span color=\"white\" font-family=\"Verdana\" font-size=\"12px\">' + text + '</SPAN></div>'); } else { htmlText.set('html', ''); } }; var playListItem = playList.get('items')[index]; if(htmlText.get('html')){ setHtml('Loading...'); playListItem.bind('begin', beginFunction); } else{ setMediaLabel(index); } } }; var disposeFunction = function(){ htmlText.set('html', undefined); playList.unbind('change', changeFunction, this); playListItemStopToDispose.unbind('stop', disposeFunction, this); }; if(playListItemStopToDispose){ playListItemStopToDispose.bind('stop', disposeFunction, this); } playList.bind('change', changeFunction, this); changeFunction(); },
  "resumeGlobalAudios": function(caller){  if (window.pauseGlobalAudiosState == undefined || !(caller in window.pauseGlobalAudiosState)) return; var audiosPaused = window.pauseGlobalAudiosState[caller]; delete window.pauseGlobalAudiosState[caller]; var values = Object.values(window.pauseGlobalAudiosState); for (var i = 0, count = values.length; i<count; ++i) { var objAudios = values[i]; for (var j = audiosPaused.length-1; j>=0; --j) { var a = audiosPaused[j]; if(objAudios.indexOf(a) != -1) audiosPaused.splice(j, 1); } } for (var i = 0, count = audiosPaused.length; i<count; ++i) { var a = audiosPaused[i]; if (a.get('state') == 'paused') a.play(); } },
  "pauseCurrentPlayers": function(onlyPauseCameraIfPanorama){  var players = this.getCurrentPlayers(); var i = players.length; while(i-- > 0){ var player = players[i]; if(player.get('state') == 'playing') { if(onlyPauseCameraIfPanorama && player.get('class') == 'PanoramaPlayer' && typeof player.get('video') === 'undefined'){ player.pauseCamera(); } else { player.pause(); } } else { players.splice(i, 1); } } return players; },
  "pauseGlobalAudios": function(caller, exclude){  if (window.pauseGlobalAudiosState == undefined) window.pauseGlobalAudiosState = {}; if (window.pauseGlobalAudiosList == undefined) window.pauseGlobalAudiosList = []; if (caller in window.pauseGlobalAudiosState) { return; } var audios = this.getByClassName('Audio').concat(this.getByClassName('VideoPanoramaOverlay')); if (window.currentGlobalAudios != undefined) audios = audios.concat(Object.values(window.currentGlobalAudios)); var audiosPaused = []; var values = Object.values(window.pauseGlobalAudiosState); for (var i = 0, count = values.length; i<count; ++i) { var objAudios = values[i]; for (var j = 0; j<objAudios.length; ++j) { var a = objAudios[j]; if(audiosPaused.indexOf(a) == -1) audiosPaused.push(a); } } window.pauseGlobalAudiosState[caller] = audiosPaused; for (var i = 0, count = audios.length; i < count; ++i) { var a = audios[i]; if (a.get('state') == 'playing' && (exclude == undefined || exclude.indexOf(a) == -1)) { a.pause(); audiosPaused.push(a); } } },
  "historyGoForward": function(playList){  var history = this.get('data')['history'][playList.get('id')]; if(history != undefined) { history.forward(); } },
  "keepComponentVisibility": function(component, keep){  var key = 'keepVisibility_' + component.get('id'); var value = this.getKey(key); if(value == undefined && keep) { this.registerKey(key, keep); } else if(value != undefined && !keep) { this.unregisterKey(key); } },
  "getCurrentPlayerWithMedia": function(media){  var playerClass = undefined; var mediaPropertyName = undefined; switch(media.get('class')) { case 'Panorama': case 'LivePanorama': case 'HDRPanorama': playerClass = 'PanoramaPlayer'; mediaPropertyName = 'panorama'; break; case 'Video360': playerClass = 'PanoramaPlayer'; mediaPropertyName = 'video'; break; case 'PhotoAlbum': playerClass = 'PhotoAlbumPlayer'; mediaPropertyName = 'photoAlbum'; break; case 'Map': playerClass = 'MapPlayer'; mediaPropertyName = 'map'; break; case 'Video': playerClass = 'VideoPlayer'; mediaPropertyName = 'video'; break; }; if(playerClass != undefined) { var players = this.getByClassName(playerClass); for(var i = 0; i<players.length; ++i){ var player = players[i]; if(player.get(mediaPropertyName) == media) { return player; } } } else { return undefined; } },
  "startPanoramaWithCamera": function(media, camera){  if(window.currentPanoramasWithCameraChanged != undefined && window.currentPanoramasWithCameraChanged.indexOf(media) != -1){ return; } var playLists = this.getByClassName('PlayList'); if(playLists.length == 0) return; var restoreItems = []; for(var i = 0, count = playLists.length; i<count; ++i){ var playList = playLists[i]; var items = playList.get('items'); for(var j = 0, countJ = items.length; j<countJ; ++j){ var item = items[j]; if(item.get('media') == media && (item.get('class') == 'PanoramaPlayListItem' || item.get('class') == 'Video360PlayListItem')){ restoreItems.push({camera: item.get('camera'), item: item}); item.set('camera', camera); } } } if(restoreItems.length > 0) { if(window.currentPanoramasWithCameraChanged == undefined) { window.currentPanoramasWithCameraChanged = [media]; } else { window.currentPanoramasWithCameraChanged.push(media); } var restoreCameraOnStop = function(){ var index = window.currentPanoramasWithCameraChanged.indexOf(media); if(index != -1) { window.currentPanoramasWithCameraChanged.splice(index, 1); } for (var i = 0; i < restoreItems.length; i++) { restoreItems[i].item.set('camera', restoreItems[i].camera); restoreItems[i].item.unbind('stop', restoreCameraOnStop, this); } }; for (var i = 0; i < restoreItems.length; i++) { restoreItems[i].item.bind('stop', restoreCameraOnStop, this); } } },
  "loadFromCurrentMediaPlayList": function(playList, delta){  var currentIndex = playList.get('selectedIndex'); var totalItems = playList.get('items').length; var newIndex = (currentIndex + delta) % totalItems; while(newIndex < 0){ newIndex = totalItems + newIndex; }; if(currentIndex != newIndex){ playList.set('selectedIndex', newIndex); } },
  "unregisterKey": function(key){  delete window[key]; },
  "setComponentVisibility": function(component, visible, applyAt, effect, propertyEffect, ignoreClearTimeout){  var keepVisibility = this.getKey('keepVisibility_' + component.get('id')); if(keepVisibility) return; this.unregisterKey('visibility_'+component.get('id')); var changeVisibility = function(){ if(effect && propertyEffect){ component.set(propertyEffect, effect); } component.set('visible', visible); if(component.get('class') == 'ViewerArea'){ try{ if(visible) component.restart(); else if(component.get('playbackState') == 'playing') component.pause(); } catch(e){}; } }; var effectTimeoutName = 'effectTimeout_'+component.get('id'); if(!ignoreClearTimeout && window.hasOwnProperty(effectTimeoutName)){ var effectTimeout = window[effectTimeoutName]; if(effectTimeout instanceof Array){ for(var i=0; i<effectTimeout.length; i++){ clearTimeout(effectTimeout[i]) } }else{ clearTimeout(effectTimeout); } delete window[effectTimeoutName]; } else if(visible == component.get('visible') && !ignoreClearTimeout) return; if(applyAt && applyAt > 0){ var effectTimeout = setTimeout(function(){ if(window[effectTimeoutName] instanceof Array) { var arrayTimeoutVal = window[effectTimeoutName]; var index = arrayTimeoutVal.indexOf(effectTimeout); arrayTimeoutVal.splice(index, 1); if(arrayTimeoutVal.length == 0){ delete window[effectTimeoutName]; } }else{ delete window[effectTimeoutName]; } changeVisibility(); }, applyAt); if(window.hasOwnProperty(effectTimeoutName)){ window[effectTimeoutName] = [window[effectTimeoutName], effectTimeout]; }else{ window[effectTimeoutName] = effectTimeout; } } else{ changeVisibility(); } },
  "registerKey": function(key, value){  window[key] = value; },
  "pauseGlobalAudiosWhilePlayItem": function(playList, index, exclude){  var self = this; var item = playList.get('items')[index]; var media = item.get('media'); var player = item.get('player'); var caller = media.get('id'); var endFunc = function(){ if(playList.get('selectedIndex') != index) { if(hasState){ player.unbind('stateChange', stateChangeFunc, self); } self.resumeGlobalAudios(caller); } }; var stateChangeFunc = function(event){ var state = event.data.state; if(state == 'stopped'){ this.resumeGlobalAudios(caller); } else if(state == 'playing'){ this.pauseGlobalAudios(caller, exclude); } }; var mediaClass = media.get('class'); var hasState = mediaClass == 'Video360' || mediaClass == 'Video'; if(hasState){ player.bind('stateChange', stateChangeFunc, this); } this.pauseGlobalAudios(caller, exclude); this.executeFunctionWhenChange(playList, index, endFunc, endFunc); },
  "shareWhatsapp": function(url){  window.open('https://api.whatsapp.com/send/?text=' + encodeURIComponent(url), '_blank'); },
  "getKey": function(key){  return window[key]; },
  "setMainMediaByName": function(name){  var items = this.mainPlayList.get('items'); for(var i = 0; i<items.length; ++i){ var item = items[i]; if(item.get('media').get('label') == name) { this.mainPlayList.set('selectedIndex', i); return item; } } },
  "visibleComponentsIfPlayerFlagEnabled": function(components, playerFlag){  var enabled = this.get(playerFlag); for(var i in components){ components[i].set('visible', enabled); } },
  "stopGlobalAudio": function(audio){  var audios = window.currentGlobalAudios; if(audios){ audio = audios[audio.get('id')]; if(audio){ delete audios[audio.get('id')]; if(Object.keys(audios).length == 0){ window.currentGlobalAudios = undefined; } } } if(audio) audio.stop(); },
  "getPlayListWithMedia": function(media, onlySelected){  var playLists = this.getByClassName('PlayList'); for(var i = 0, count = playLists.length; i<count; ++i){ var playList = playLists[i]; if(onlySelected && playList.get('selectedIndex') == -1) continue; if(this.getPlayListItemByMedia(playList, media) != undefined) return playList; } return undefined; },
  "showComponentsWhileMouseOver": function(parentComponent, components, durationVisibleWhileOut){  var setVisibility = function(visible){ for(var i = 0, length = components.length; i<length; i++){ var component = components[i]; if(component.get('class') == 'HTMLText' && (component.get('html') == '' || component.get('html') == undefined)) { continue; } component.set('visible', visible); } }; if (this.rootPlayer.get('touchDevice') == true){ setVisibility(true); } else { var timeoutID = -1; var rollOverFunction = function(){ setVisibility(true); if(timeoutID >= 0) clearTimeout(timeoutID); parentComponent.unbind('rollOver', rollOverFunction, this); parentComponent.bind('rollOut', rollOutFunction, this); }; var rollOutFunction = function(){ var timeoutFunction = function(){ setVisibility(false); parentComponent.unbind('rollOver', rollOverFunction, this); }; parentComponent.unbind('rollOut', rollOutFunction, this); parentComponent.bind('rollOver', rollOverFunction, this); timeoutID = setTimeout(timeoutFunction, durationVisibleWhileOut); }; parentComponent.bind('rollOver', rollOverFunction, this); } },
  "showPopupPanoramaOverlay": function(popupPanoramaOverlay, closeButtonProperties, imageHD, toggleImage, toggleImageHD, autoCloseMilliSeconds, audio, stopBackgroundAudio){  var self = this; this.MainViewer.set('toolTipEnabled', false); var cardboardEnabled = this.isCardboardViewMode(); if(!cardboardEnabled) { var zoomImage = this.zoomImagePopupPanorama; var showDuration = popupPanoramaOverlay.get('showDuration'); var hideDuration = popupPanoramaOverlay.get('hideDuration'); var playersPaused = this.pauseCurrentPlayers(audio == null || !stopBackgroundAudio); var popupMaxWidthBackup = popupPanoramaOverlay.get('popupMaxWidth'); var popupMaxHeightBackup = popupPanoramaOverlay.get('popupMaxHeight'); var showEndFunction = function() { var loadedFunction = function(){ if(!self.isCardboardViewMode()) popupPanoramaOverlay.set('visible', false); }; popupPanoramaOverlay.unbind('showEnd', showEndFunction, self); popupPanoramaOverlay.set('showDuration', 1); popupPanoramaOverlay.set('hideDuration', 1); self.showPopupImage(imageHD, toggleImageHD, popupPanoramaOverlay.get('popupMaxWidth'), popupPanoramaOverlay.get('popupMaxHeight'), null, null, closeButtonProperties, autoCloseMilliSeconds, audio, stopBackgroundAudio, loadedFunction, hideFunction); }; var hideFunction = function() { var restoreShowDurationFunction = function(){ popupPanoramaOverlay.unbind('showEnd', restoreShowDurationFunction, self); popupPanoramaOverlay.set('visible', false); popupPanoramaOverlay.set('showDuration', showDuration); popupPanoramaOverlay.set('popupMaxWidth', popupMaxWidthBackup); popupPanoramaOverlay.set('popupMaxHeight', popupMaxHeightBackup); }; self.resumePlayers(playersPaused, audio == null || !stopBackgroundAudio); var currentWidth = zoomImage.get('imageWidth'); var currentHeight = zoomImage.get('imageHeight'); popupPanoramaOverlay.bind('showEnd', restoreShowDurationFunction, self, true); popupPanoramaOverlay.set('showDuration', 1); popupPanoramaOverlay.set('hideDuration', hideDuration); popupPanoramaOverlay.set('popupMaxWidth', currentWidth); popupPanoramaOverlay.set('popupMaxHeight', currentHeight); if(popupPanoramaOverlay.get('visible')) restoreShowDurationFunction(); else popupPanoramaOverlay.set('visible', true); self.MainViewer.set('toolTipEnabled', true); }; if(!imageHD){ imageHD = popupPanoramaOverlay.get('image'); } if(!toggleImageHD && toggleImage){ toggleImageHD = toggleImage; } popupPanoramaOverlay.bind('showEnd', showEndFunction, this, true); } else { var hideEndFunction = function() { self.resumePlayers(playersPaused, audio == null || stopBackgroundAudio); if(audio){ if(stopBackgroundAudio){ self.resumeGlobalAudios(); } self.stopGlobalAudio(audio); } popupPanoramaOverlay.unbind('hideEnd', hideEndFunction, self); self.MainViewer.set('toolTipEnabled', true); }; var playersPaused = this.pauseCurrentPlayers(audio == null || !stopBackgroundAudio); if(audio){ if(stopBackgroundAudio){ this.pauseGlobalAudios(); } this.playGlobalAudio(audio); } popupPanoramaOverlay.bind('hideEnd', hideEndFunction, this, true); } popupPanoramaOverlay.set('visible', true); },
  "showPopupMedia": function(w, media, playList, popupMaxWidth, popupMaxHeight, autoCloseWhenFinished, stopAudios){  var self = this; var closeFunction = function(){ playList.set('selectedIndex', -1); self.MainViewer.set('toolTipEnabled', true); if(stopAudios) { self.resumeGlobalAudios(); } this.resumePlayers(playersPaused, !stopAudios); if(isVideo) { this.unbind('resize', resizeFunction, this); } w.unbind('close', closeFunction, this); }; var endFunction = function(){ w.hide(); }; var resizeFunction = function(){ var getWinValue = function(property){ return w.get(property) || 0; }; var parentWidth = self.get('actualWidth'); var parentHeight = self.get('actualHeight'); var mediaWidth = self.getMediaWidth(media); var mediaHeight = self.getMediaHeight(media); var popupMaxWidthNumber = parseFloat(popupMaxWidth) / 100; var popupMaxHeightNumber = parseFloat(popupMaxHeight) / 100; var windowWidth = popupMaxWidthNumber * parentWidth; var windowHeight = popupMaxHeightNumber * parentHeight; var footerHeight = getWinValue('footerHeight'); var headerHeight = getWinValue('headerHeight'); if(!headerHeight) { var closeButtonHeight = getWinValue('closeButtonIconHeight') + getWinValue('closeButtonPaddingTop') + getWinValue('closeButtonPaddingBottom'); var titleHeight = self.getPixels(getWinValue('titleFontSize')) + getWinValue('titlePaddingTop') + getWinValue('titlePaddingBottom'); headerHeight = closeButtonHeight > titleHeight ? closeButtonHeight : titleHeight; headerHeight += getWinValue('headerPaddingTop') + getWinValue('headerPaddingBottom'); } var contentWindowWidth = windowWidth - getWinValue('bodyPaddingLeft') - getWinValue('bodyPaddingRight') - getWinValue('paddingLeft') - getWinValue('paddingRight'); var contentWindowHeight = windowHeight - headerHeight - footerHeight - getWinValue('bodyPaddingTop') - getWinValue('bodyPaddingBottom') - getWinValue('paddingTop') - getWinValue('paddingBottom'); var parentAspectRatio = contentWindowWidth / contentWindowHeight; var mediaAspectRatio = mediaWidth / mediaHeight; if(parentAspectRatio > mediaAspectRatio) { windowWidth = contentWindowHeight * mediaAspectRatio + getWinValue('bodyPaddingLeft') + getWinValue('bodyPaddingRight') + getWinValue('paddingLeft') + getWinValue('paddingRight'); } else { windowHeight = contentWindowWidth / mediaAspectRatio + headerHeight + footerHeight + getWinValue('bodyPaddingTop') + getWinValue('bodyPaddingBottom') + getWinValue('paddingTop') + getWinValue('paddingBottom'); } if(windowWidth > parentWidth * popupMaxWidthNumber) { windowWidth = parentWidth * popupMaxWidthNumber; } if(windowHeight > parentHeight * popupMaxHeightNumber) { windowHeight = parentHeight * popupMaxHeightNumber; } w.set('width', windowWidth); w.set('height', windowHeight); w.set('x', (parentWidth - getWinValue('actualWidth')) * 0.5); w.set('y', (parentHeight - getWinValue('actualHeight')) * 0.5); }; if(autoCloseWhenFinished){ this.executeFunctionWhenChange(playList, 0, endFunction); } var mediaClass = media.get('class'); var isVideo = mediaClass == 'Video' || mediaClass == 'Video360'; playList.set('selectedIndex', 0); if(isVideo){ this.bind('resize', resizeFunction, this); resizeFunction(); playList.get('items')[0].get('player').play(); } else { w.set('width', popupMaxWidth); w.set('height', popupMaxHeight); } this.MainViewer.set('toolTipEnabled', false); if(stopAudios) { this.pauseGlobalAudios(); } var playersPaused = this.pauseCurrentPlayers(!stopAudios); w.bind('close', closeFunction, this); w.show(this, true); },
  "setMediaBehaviour": function(playList, index, mediaDispatcher){  var self = this; var stateChangeFunction = function(event){ if(event.data.state == 'stopped'){ dispose.call(this, true); } }; var onBeginFunction = function() { item.unbind('begin', onBeginFunction, self); var media = item.get('media'); if(media.get('class') != 'Panorama' || (media.get('camera') != undefined && media.get('camera').get('initialSequence') != undefined)){ player.bind('stateChange', stateChangeFunction, self); } }; var changeFunction = function(){ var index = playListDispatcher.get('selectedIndex'); if(index != -1){ indexDispatcher = index; dispose.call(this, false); } }; var disposeCallback = function(){ dispose.call(this, false); }; var dispose = function(forceDispose){ if(!playListDispatcher) return; var media = item.get('media'); if((media.get('class') == 'Video360' || media.get('class') == 'Video') && media.get('loop') == true && !forceDispose) return; playList.set('selectedIndex', -1); if(panoramaSequence && panoramaSequenceIndex != -1){ if(panoramaSequence) { if(panoramaSequenceIndex > 0 && panoramaSequence.get('movements')[panoramaSequenceIndex-1].get('class') == 'TargetPanoramaCameraMovement'){ var initialPosition = camera.get('initialPosition'); var oldYaw = initialPosition.get('yaw'); var oldPitch = initialPosition.get('pitch'); var oldHfov = initialPosition.get('hfov'); var previousMovement = panoramaSequence.get('movements')[panoramaSequenceIndex-1]; initialPosition.set('yaw', previousMovement.get('targetYaw')); initialPosition.set('pitch', previousMovement.get('targetPitch')); initialPosition.set('hfov', previousMovement.get('targetHfov')); var restoreInitialPositionFunction = function(event){ initialPosition.set('yaw', oldYaw); initialPosition.set('pitch', oldPitch); initialPosition.set('hfov', oldHfov); itemDispatcher.unbind('end', restoreInitialPositionFunction, this); }; itemDispatcher.bind('end', restoreInitialPositionFunction, this); } panoramaSequence.set('movementIndex', panoramaSequenceIndex); } } if(player){ item.unbind('begin', onBeginFunction, this); player.unbind('stateChange', stateChangeFunction, this); for(var i = 0; i<buttons.length; ++i) { buttons[i].unbind('click', disposeCallback, this); } } if(sameViewerArea){ var currentMedia = this.getMediaFromPlayer(player); if(currentMedia == undefined || currentMedia == item.get('media')){ playListDispatcher.set('selectedIndex', indexDispatcher); } if(playList != playListDispatcher) playListDispatcher.unbind('change', changeFunction, this); } else{ viewerArea.set('visible', viewerVisibility); } playListDispatcher = undefined; }; var mediaDispatcherByParam = mediaDispatcher != undefined; if(!mediaDispatcher){ var currentIndex = playList.get('selectedIndex'); var currentPlayer = (currentIndex != -1) ? playList.get('items')[playList.get('selectedIndex')].get('player') : this.getActivePlayerWithViewer(this.MainViewer); if(currentPlayer) { mediaDispatcher = this.getMediaFromPlayer(currentPlayer); } } var playListDispatcher = mediaDispatcher ? this.getPlayListWithMedia(mediaDispatcher, true) : undefined; if(!playListDispatcher){ playList.set('selectedIndex', index); return; } var indexDispatcher = playListDispatcher.get('selectedIndex'); if(playList.get('selectedIndex') == index || indexDispatcher == -1){ return; } var item = playList.get('items')[index]; var itemDispatcher = playListDispatcher.get('items')[indexDispatcher]; var player = item.get('player'); var viewerArea = player.get('viewerArea'); var viewerVisibility = viewerArea.get('visible'); var sameViewerArea = viewerArea == itemDispatcher.get('player').get('viewerArea'); if(sameViewerArea){ if(playList != playListDispatcher){ playListDispatcher.set('selectedIndex', -1); playListDispatcher.bind('change', changeFunction, this); } } else{ viewerArea.set('visible', true); } var panoramaSequenceIndex = -1; var panoramaSequence = undefined; var camera = itemDispatcher.get('camera'); if(camera){ panoramaSequence = camera.get('initialSequence'); if(panoramaSequence) { panoramaSequenceIndex = panoramaSequence.get('movementIndex'); } } playList.set('selectedIndex', index); var buttons = []; var addButtons = function(property){ var value = player.get(property); if(value == undefined) return; if(Array.isArray(value)) buttons = buttons.concat(value); else buttons.push(value); }; addButtons('buttonStop'); for(var i = 0; i<buttons.length; ++i) { buttons[i].bind('click', disposeCallback, this); } if(player != itemDispatcher.get('player') || !mediaDispatcherByParam){ item.bind('begin', onBeginFunction, self); } this.executeFunctionWhenChange(playList, index, disposeCallback); },
  "cloneCamera": function(camera){  var newCamera = this.rootPlayer.createInstance(camera.get('class')); newCamera.set('id', camera.get('id') + '_copy'); newCamera.set('idleSequence', camera.get('initialSequence')); return newCamera; },
  "setOverlayBehaviour": function(overlay, media, action){  var executeFunc = function() { switch(action){ case 'triggerClick': this.triggerOverlay(overlay, 'click'); break; case 'stop': case 'play': case 'pause': overlay[action](); break; case 'togglePlayPause': case 'togglePlayStop': if(overlay.get('state') == 'playing') overlay[action == 'togglePlayPause' ? 'pause' : 'stop'](); else overlay.play(); break; } if(window.overlaysDispatched == undefined) window.overlaysDispatched = {}; var id = overlay.get('id'); window.overlaysDispatched[id] = true; setTimeout(function(){ delete window.overlaysDispatched[id]; }, 2000); }; if(window.overlaysDispatched != undefined && overlay.get('id') in window.overlaysDispatched) return; var playList = this.getPlayListWithMedia(media, true); if(playList != undefined){ var item = this.getPlayListItemByMedia(playList, media); if(playList.get('items').indexOf(item) != playList.get('selectedIndex')){ var beginFunc = function(e){ item.unbind('begin', beginFunc, this); executeFunc.call(this); }; item.bind('begin', beginFunc, this); return; } } executeFunc.call(this); },
  "changePlayListWithSameSpot": function(playList, newIndex){  var currentIndex = playList.get('selectedIndex'); if (currentIndex >= 0 && newIndex >= 0 && currentIndex != newIndex) { var currentItem = playList.get('items')[currentIndex]; var newItem = playList.get('items')[newIndex]; var currentPlayer = currentItem.get('player'); var newPlayer = newItem.get('player'); if ((currentPlayer.get('class') == 'PanoramaPlayer' || currentPlayer.get('class') == 'Video360Player') && (newPlayer.get('class') == 'PanoramaPlayer' || newPlayer.get('class') == 'Video360Player')) { var newCamera = this.cloneCamera(newItem.get('camera')); this.setCameraSameSpotAsMedia(newCamera, currentItem.get('media')); this.startPanoramaWithCamera(newItem.get('media'), newCamera); } } },
  "stopAndGoCamera": function(camera, ms){  var sequence = camera.get('initialSequence'); sequence.pause(); var timeoutFunction = function(){ sequence.play(); }; setTimeout(timeoutFunction, ms); },
  "init": function(){  if(!Object.hasOwnProperty('values')) { Object.values = function(o){ return Object.keys(o).map(function(e) { return o[e]; }); }; } var history = this.get('data')['history']; var playListChangeFunc = function(e){ var playList = e.source; var index = playList.get('selectedIndex'); if(index < 0) return; var id = playList.get('id'); if(!history.hasOwnProperty(id)) history[id] = new HistoryData(playList); history[id].add(index); }; var playLists = this.getByClassName('PlayList'); for(var i = 0, count = playLists.length; i<count; ++i) { var playList = playLists[i]; playList.bind('change', playListChangeFunc, this); } },
  "setMainMediaByIndex": function(index){  var item = undefined; if(index >= 0 && index < this.mainPlayList.get('items').length){ this.mainPlayList.set('selectedIndex', index); item = this.mainPlayList.get('items')[index]; } return item; },
  "getActivePlayerWithViewer": function(viewerArea){  var players = this.getByClassName('PanoramaPlayer'); players = players.concat(this.getByClassName('VideoPlayer')); players = players.concat(this.getByClassName('Video360Player')); players = players.concat(this.getByClassName('PhotoAlbumPlayer')); players = players.concat(this.getByClassName('MapPlayer')); var i = players.length; while(i-- > 0){ var player = players[i]; if(player.get('viewerArea') == viewerArea) { var playerClass = player.get('class'); if(playerClass == 'PanoramaPlayer' && (player.get('panorama') != undefined || player.get('video') != undefined)) return player; else if((playerClass == 'VideoPlayer' || playerClass == 'Video360Player') && player.get('video') != undefined) return player; else if(playerClass == 'PhotoAlbumPlayer' && player.get('photoAlbum') != undefined) return player; else if(playerClass == 'MapPlayer' && player.get('map') != undefined) return player; } } return undefined; },
  "getPixels": function(value){  var result = new RegExp('((\\+|\\-)?\\d+(\\.\\d*)?)(px|vw|vh|vmin|vmax)?', 'i').exec(value); if (result == undefined) { return 0; } var num = parseFloat(result[1]); var unit = result[4]; var vw = this.rootPlayer.get('actualWidth') / 100; var vh = this.rootPlayer.get('actualHeight') / 100; switch(unit) { case 'vw': return num * vw; case 'vh': return num * vh; case 'vmin': return num * Math.min(vw, vh); case 'vmax': return num * Math.max(vw, vh); default: return num; } },
  "getMediaByName": function(name){  var list = this.getByClassName('Media'); for(var i = 0, count = list.length; i<count; ++i){ var media = list[i]; if((media.get('class') == 'Audio' && media.get('data').label == name) || media.get('label') == name){ return media; } } return undefined; },
  "executeFunctionWhenChange": function(playList, index, endFunction, changeFunction){  var endObject = undefined; var changePlayListFunction = function(event){ if(event.data.previousSelectedIndex == index){ if(changeFunction) changeFunction.call(this); if(endFunction && endObject) endObject.unbind('end', endFunction, this); playList.unbind('change', changePlayListFunction, this); } }; if(endFunction){ var playListItem = playList.get('items')[index]; if(playListItem.get('class') == 'PanoramaPlayListItem'){ var camera = playListItem.get('camera'); if(camera != undefined) endObject = camera.get('initialSequence'); if(endObject == undefined) endObject = camera.get('idleSequence'); } else{ endObject = playListItem.get('media'); } if(endObject){ endObject.bind('end', endFunction, this); } } playList.bind('change', changePlayListFunction, this); },
  "fixTogglePlayPauseButton": function(player){  var state = player.get('state'); var buttons = player.get('buttonPlayPause'); if(typeof buttons !== 'undefined' && player.get('state') == 'playing'){ if(!Array.isArray(buttons)) buttons = [buttons]; for(var i = 0; i<buttons.length; ++i) buttons[i].set('pressed', true); } },
  "getComponentByName": function(name){  var list = this.getByClassName('UIComponent'); for(var i = 0, count = list.length; i<count; ++i){ var component = list[i]; var data = component.get('data'); if(data != undefined && data.name == name){ return component; } } return undefined; },
  "setMapLocation": function(panoramaPlayListItem, mapPlayer){  var resetFunction = function(){ panoramaPlayListItem.unbind('stop', resetFunction, this); player.set('mapPlayer', null); }; panoramaPlayListItem.bind('stop', resetFunction, this); var player = panoramaPlayListItem.get('player'); player.set('mapPlayer', mapPlayer); },
  "loopAlbum": function(playList, index){  var playListItem = playList.get('items')[index]; var player = playListItem.get('player'); var loopFunction = function(){ player.play(); }; this.executeFunctionWhenChange(playList, index, loopFunction); },
  "setEndToItemIndex": function(playList, fromIndex, toIndex){  var endFunction = function(){ if(playList.get('selectedIndex') == fromIndex) playList.set('selectedIndex', toIndex); }; this.executeFunctionWhenChange(playList, fromIndex, endFunction); },
  "playAudioList": function(audios){  if(audios.length == 0) return; var currentAudioCount = -1; var currentAudio; var playGlobalAudioFunction = this.playGlobalAudio; var playNext = function(){ if(++currentAudioCount >= audios.length) currentAudioCount = 0; currentAudio = audios[currentAudioCount]; playGlobalAudioFunction(currentAudio, playNext); }; playNext(); },
  "getPlayListItems": function(media, player){  var itemClass = (function() { switch(media.get('class')) { case 'Panorama': case 'LivePanorama': case 'HDRPanorama': return 'PanoramaPlayListItem'; case 'Video360': return 'Video360PlayListItem'; case 'PhotoAlbum': return 'PhotoAlbumPlayListItem'; case 'Map': return 'MapPlayListItem'; case 'Video': return 'VideoPlayListItem'; } })(); if (itemClass != undefined) { var items = this.getByClassName(itemClass); for (var i = items.length-1; i>=0; --i) { var item = items[i]; if(item.get('media') != media || (player != undefined && item.get('player') != player)) { items.splice(i, 1); } } return items; } else { return []; } },
  "getOverlays": function(media){  switch(media.get('class')){ case 'Panorama': var overlays = media.get('overlays').concat() || []; var frames = media.get('frames'); for(var j = 0; j<frames.length; ++j){ overlays = overlays.concat(frames[j].get('overlays') || []); } return overlays; case 'Video360': case 'Map': return media.get('overlays') || []; default: return []; } },
  "getPanoramaOverlayByName": function(panorama, name){  var overlays = this.getOverlays(panorama); for(var i = 0, count = overlays.length; i<count; ++i){ var overlay = overlays[i]; var data = overlay.get('data'); if(data != undefined && data.label == name){ return overlay; } } return undefined; },
  "existsKey": function(key){  return key in window; },
  "updateVideoCues": function(playList, index){  var playListItem = playList.get('items')[index]; var video = playListItem.get('media'); if(video.get('cues').length == 0) return; var player = playListItem.get('player'); var cues = []; var changeFunction = function(){ if(playList.get('selectedIndex') != index){ video.unbind('cueChange', cueChangeFunction, this); playList.unbind('change', changeFunction, this); } }; var cueChangeFunction = function(event){ var activeCues = event.data.activeCues; for(var i = 0, count = cues.length; i<count; ++i){ var cue = cues[i]; if(activeCues.indexOf(cue) == -1 && (cue.get('startTime') > player.get('currentTime') || cue.get('endTime') < player.get('currentTime')+0.5)){ cue.trigger('end'); } } cues = activeCues; }; video.bind('cueChange', cueChangeFunction, this); playList.bind('change', changeFunction, this); },
  "getMediaHeight": function(media){  switch(media.get('class')){ case 'Video360': var res = media.get('video'); if(res instanceof Array){ var maxH=0; for(var i=0; i<res.length; i++){ var r = res[i]; if(r.get('height') > maxH) maxH = r.get('height'); } return maxH; }else{ return r.get('height') } default: return media.get('height'); } },
  "getCurrentPlayers": function(){  var players = this.getByClassName('PanoramaPlayer'); players = players.concat(this.getByClassName('VideoPlayer')); players = players.concat(this.getByClassName('Video360Player')); players = players.concat(this.getByClassName('PhotoAlbumPlayer')); return players; },
  "resumePlayers": function(players, onlyResumeCameraIfPanorama){  for(var i = 0; i<players.length; ++i){ var player = players[i]; if(onlyResumeCameraIfPanorama && player.get('class') == 'PanoramaPlayer' && typeof player.get('video') === 'undefined'){ player.resumeCamera(); } else{ player.play(); } } },
  "shareFacebook": function(url){  window.open('https://www.facebook.com/sharer/sharer.php?u=' + url, '_blank'); },
  "setCameraSameSpotAsMedia": function(camera, media){  var player = this.getCurrentPlayerWithMedia(media); if(player != undefined) { var position = camera.get('initialPosition'); position.set('yaw', player.get('yaw')); position.set('pitch', player.get('pitch')); position.set('hfov', player.get('hfov')); } },
  "playGlobalAudio": function(audio, endCallback){  var endFunction = function(){ audio.unbind('end', endFunction, this); this.stopGlobalAudio(audio); if(endCallback) endCallback(); }; audio = this.getGlobalAudio(audio); var audios = window.currentGlobalAudios; if(!audios){ audios = window.currentGlobalAudios = {}; } audios[audio.get('id')] = audio; if(audio.get('state') == 'playing'){ return audio; } if(!audio.get('loop')){ audio.bind('end', endFunction, this); } audio.play(); return audio; },
  "showPopupPanoramaVideoOverlay": function(popupPanoramaOverlay, closeButtonProperties, stopAudios){  var self = this; var showEndFunction = function() { popupPanoramaOverlay.unbind('showEnd', showEndFunction); closeButton.bind('click', hideFunction, this); setCloseButtonPosition(); closeButton.set('visible', true); }; var endFunction = function() { if(!popupPanoramaOverlay.get('loop')) hideFunction(); }; var hideFunction = function() { self.MainViewer.set('toolTipEnabled', true); popupPanoramaOverlay.set('visible', false); closeButton.set('visible', false); closeButton.unbind('click', hideFunction, self); popupPanoramaOverlay.unbind('end', endFunction, self); popupPanoramaOverlay.unbind('hideEnd', hideFunction, self, true); self.resumePlayers(playersPaused, true); if(stopAudios) { self.resumeGlobalAudios(); } }; var setCloseButtonPosition = function() { var right = 10; var top = 10; closeButton.set('right', right); closeButton.set('top', top); }; this.MainViewer.set('toolTipEnabled', false); var closeButton = this.closeButtonPopupPanorama; if(closeButtonProperties){ for(var key in closeButtonProperties){ closeButton.set(key, closeButtonProperties[key]); } } var playersPaused = this.pauseCurrentPlayers(true); if(stopAudios) { this.pauseGlobalAudios(); } popupPanoramaOverlay.bind('end', endFunction, this, true); popupPanoramaOverlay.bind('showEnd', showEndFunction, this, true); popupPanoramaOverlay.bind('hideEnd', hideFunction, this, true); popupPanoramaOverlay.set('visible', true); },
  "autotriggerAtStart": function(playList, callback, once){  var onChange = function(event){ callback(); if(once == true) playList.unbind('change', onChange, this); }; playList.bind('change', onChange, this); },
  "showWindow": function(w, autoCloseMilliSeconds, containsAudio){  if(w.get('visible') == true){ return; } var closeFunction = function(){ clearAutoClose(); this.resumePlayers(playersPaused, !containsAudio); w.unbind('close', closeFunction, this); }; var clearAutoClose = function(){ w.unbind('click', clearAutoClose, this); if(timeoutID != undefined){ clearTimeout(timeoutID); } }; var timeoutID = undefined; if(autoCloseMilliSeconds){ var autoCloseFunction = function(){ w.hide(); }; w.bind('click', clearAutoClose, this); timeoutID = setTimeout(autoCloseFunction, autoCloseMilliSeconds); } var playersPaused = this.pauseCurrentPlayers(!containsAudio); w.bind('close', closeFunction, this); w.show(this, true); },
  "triggerOverlay": function(overlay, eventName){  if(overlay.get('areas') != undefined) { var areas = overlay.get('areas'); for(var i = 0; i<areas.length; ++i) { areas[i].trigger(eventName); } } else { overlay.trigger(eventName); } },
  "isCardboardViewMode": function(){  var players = this.getByClassName('PanoramaPlayer'); return players.length > 0 && players[0].get('viewMode') == 'cardboard'; },
  "getPlayListItemByMedia": function(playList, media){  var items = playList.get('items'); for(var j = 0, countJ = items.length; j<countJ; ++j){ var item = items[j]; if(item.get('media') == media) return item; } return undefined; },
  "changeBackgroundWhilePlay": function(playList, index, color){  var stopFunction = function(event){ playListItem.unbind('stop', stopFunction, this); if((color == viewerArea.get('backgroundColor')) && (colorRatios == viewerArea.get('backgroundColorRatios'))){ viewerArea.set('backgroundColor', backgroundColorBackup); viewerArea.set('backgroundColorRatios', backgroundColorRatiosBackup); } }; var playListItem = playList.get('items')[index]; var player = playListItem.get('player'); var viewerArea = player.get('viewerArea'); var backgroundColorBackup = viewerArea.get('backgroundColor'); var backgroundColorRatiosBackup = viewerArea.get('backgroundColorRatios'); var colorRatios = [0]; if((color != backgroundColorBackup) || (colorRatios != backgroundColorRatiosBackup)){ viewerArea.set('backgroundColor', color); viewerArea.set('backgroundColorRatios', colorRatios); playListItem.bind('stop', stopFunction, this); } },
  "getMediaWidth": function(media){  switch(media.get('class')){ case 'Video360': var res = media.get('video'); if(res instanceof Array){ var maxW=0; for(var i=0; i<res.length; i++){ var r = res[i]; if(r.get('width') > maxW) maxW = r.get('width'); } return maxW; }else{ return r.get('width') } default: return media.get('width'); } },
  "pauseGlobalAudio": function(audio){  var audios = window.currentGlobalAudios; if(audios){ audio = audios[audio.get('id')]; } if(audio.get('state') == 'playing') audio.pause(); },
  "setStartTimeVideo": function(video, time){  var items = this.getPlayListItems(video); var startTimeBackup = []; var restoreStartTimeFunc = function() { for(var i = 0; i<items.length; ++i){ var item = items[i]; item.set('startTime', startTimeBackup[i]); item.unbind('stop', restoreStartTimeFunc, this); } }; for(var i = 0; i<items.length; ++i) { var item = items[i]; var player = item.get('player'); if(player.get('video') == video && player.get('state') == 'playing') { player.seek(time); } else { startTimeBackup.push(item.get('startTime')); item.set('startTime', time); item.bind('stop', restoreStartTimeFunc, this); } } },
  "syncPlaylists": function(playLists){  var changeToMedia = function(media, playListDispatched){ for(var i = 0, count = playLists.length; i<count; ++i){ var playList = playLists[i]; if(playList != playListDispatched){ var items = playList.get('items'); for(var j = 0, countJ = items.length; j<countJ; ++j){ if(items[j].get('media') == media){ if(playList.get('selectedIndex') != j){ playList.set('selectedIndex', j); } break; } } } } }; var changeFunction = function(event){ var playListDispatched = event.source; var selectedIndex = playListDispatched.get('selectedIndex'); if(selectedIndex < 0) return; var media = playListDispatched.get('items')[selectedIndex].get('media'); changeToMedia(media, playListDispatched); }; var mapPlayerChangeFunction = function(event){ var panoramaMapLocation = event.source.get('panoramaMapLocation'); if(panoramaMapLocation){ var map = panoramaMapLocation.get('map'); changeToMedia(map); } }; for(var i = 0, count = playLists.length; i<count; ++i){ playLists[i].bind('change', changeFunction, this); } var mapPlayers = this.getByClassName('MapPlayer'); for(var i = 0, count = mapPlayers.length; i<count; ++i){ mapPlayers[i].bind('panoramaMapLocation_change', mapPlayerChangeFunction, this); } },
  "showPopupImage": function(image, toggleImage, customWidth, customHeight, showEffect, hideEffect, closeButtonProperties, autoCloseMilliSeconds, audio, stopBackgroundAudio, loadedCallback, hideCallback){  var self = this; var closed = false; var playerClickFunction = function() { zoomImage.unbind('loaded', loadedFunction, self); hideFunction(); }; var clearAutoClose = function(){ zoomImage.unbind('click', clearAutoClose, this); if(timeoutID != undefined){ clearTimeout(timeoutID); } }; var resizeFunction = function(){ setTimeout(setCloseButtonPosition, 0); }; var loadedFunction = function(){ self.unbind('click', playerClickFunction, self); veil.set('visible', true); setCloseButtonPosition(); closeButton.set('visible', true); zoomImage.unbind('loaded', loadedFunction, this); zoomImage.bind('userInteractionStart', userInteractionStartFunction, this); zoomImage.bind('userInteractionEnd', userInteractionEndFunction, this); zoomImage.bind('resize', resizeFunction, this); timeoutID = setTimeout(timeoutFunction, 200); }; var timeoutFunction = function(){ timeoutID = undefined; if(autoCloseMilliSeconds){ var autoCloseFunction = function(){ hideFunction(); }; zoomImage.bind('click', clearAutoClose, this); timeoutID = setTimeout(autoCloseFunction, autoCloseMilliSeconds); } zoomImage.bind('backgroundClick', hideFunction, this); if(toggleImage) { zoomImage.bind('click', toggleFunction, this); zoomImage.set('imageCursor', 'hand'); } closeButton.bind('click', hideFunction, this); if(loadedCallback) loadedCallback(); }; var hideFunction = function() { self.MainViewer.set('toolTipEnabled', true); closed = true; if(timeoutID) clearTimeout(timeoutID); if (timeoutUserInteractionID) clearTimeout(timeoutUserInteractionID); if(autoCloseMilliSeconds) clearAutoClose(); if(hideCallback) hideCallback(); zoomImage.set('visible', false); if(hideEffect && hideEffect.get('duration') > 0){ hideEffect.bind('end', endEffectFunction, this); } else{ zoomImage.set('image', null); } closeButton.set('visible', false); veil.set('visible', false); self.unbind('click', playerClickFunction, self); zoomImage.unbind('backgroundClick', hideFunction, this); zoomImage.unbind('userInteractionStart', userInteractionStartFunction, this); zoomImage.unbind('userInteractionEnd', userInteractionEndFunction, this, true); zoomImage.unbind('resize', resizeFunction, this); if(toggleImage) { zoomImage.unbind('click', toggleFunction, this); zoomImage.set('cursor', 'default'); } closeButton.unbind('click', hideFunction, this); self.resumePlayers(playersPaused, audio == null || stopBackgroundAudio); if(audio){ if(stopBackgroundAudio){ self.resumeGlobalAudios(); } self.stopGlobalAudio(audio); } }; var endEffectFunction = function() { zoomImage.set('image', null); hideEffect.unbind('end', endEffectFunction, this); }; var toggleFunction = function() { zoomImage.set('image', isToggleVisible() ? image : toggleImage); }; var isToggleVisible = function() { return zoomImage.get('image') == toggleImage; }; var setCloseButtonPosition = function() { var right = zoomImage.get('actualWidth') - zoomImage.get('imageLeft') - zoomImage.get('imageWidth') + 10; var top = zoomImage.get('imageTop') + 10; if(right < 10) right = 10; if(top < 10) top = 10; closeButton.set('right', right); closeButton.set('top', top); }; var userInteractionStartFunction = function() { if(timeoutUserInteractionID){ clearTimeout(timeoutUserInteractionID); timeoutUserInteractionID = undefined; } else{ closeButton.set('visible', false); } }; var userInteractionEndFunction = function() { if(!closed){ timeoutUserInteractionID = setTimeout(userInteractionTimeoutFunction, 300); } }; var userInteractionTimeoutFunction = function() { timeoutUserInteractionID = undefined; closeButton.set('visible', true); setCloseButtonPosition(); }; this.MainViewer.set('toolTipEnabled', false); var veil = this.veilPopupPanorama; var zoomImage = this.zoomImagePopupPanorama; var closeButton = this.closeButtonPopupPanorama; if(closeButtonProperties){ for(var key in closeButtonProperties){ closeButton.set(key, closeButtonProperties[key]); } } var playersPaused = this.pauseCurrentPlayers(audio == null || !stopBackgroundAudio); if(audio){ if(stopBackgroundAudio){ this.pauseGlobalAudios(); } this.playGlobalAudio(audio); } var timeoutID = undefined; var timeoutUserInteractionID = undefined; zoomImage.bind('loaded', loadedFunction, this); setTimeout(function(){ self.bind('click', playerClickFunction, self, false); }, 0); zoomImage.set('image', image); zoomImage.set('customWidth', customWidth); zoomImage.set('customHeight', customHeight); zoomImage.set('showEffect', showEffect); zoomImage.set('hideEffect', hideEffect); zoomImage.set('visible', true); return zoomImage; },
  "shareTwitter": function(url){  window.open('https://twitter.com/intent/tweet?source=webclient&url=' + url, '_blank'); },
  "setStartTimeVideoSync": function(video, player){  this.setStartTimeVideo(video, player.get('currentTime')); },
  "playGlobalAudioWhilePlay": function(playList, index, audio, endCallback){  var changeFunction = function(event){ if(event.data.previousSelectedIndex == index){ this.stopGlobalAudio(audio); if(isPanorama) { var media = playListItem.get('media'); var audios = media.get('audios'); audios.splice(audios.indexOf(audio), 1); media.set('audios', audios); } playList.unbind('change', changeFunction, this); if(endCallback) endCallback(); } }; var audios = window.currentGlobalAudios; if(audios && audio.get('id') in audios){ audio = audios[audio.get('id')]; if(audio.get('state') != 'playing'){ audio.play(); } return audio; } playList.bind('change', changeFunction, this); var playListItem = playList.get('items')[index]; var isPanorama = playListItem.get('class') == 'PanoramaPlayListItem'; if(isPanorama) { var media = playListItem.get('media'); var audios = (media.get('audios') || []).slice(); if(audio.get('class') == 'MediaAudio') { var panoramaAudio = this.rootPlayer.createInstance('PanoramaAudio'); panoramaAudio.set('autoplay', false); panoramaAudio.set('audio', audio.get('audio')); panoramaAudio.set('loop', audio.get('loop')); panoramaAudio.set('id', audio.get('id')); var stateChangeFunctions = audio.getBindings('stateChange'); for(var i = 0; i<stateChangeFunctions.length; ++i){ var f = stateChangeFunctions[i]; if(typeof f == 'string') f = new Function('event', f); panoramaAudio.bind('stateChange', f, this); } audio = panoramaAudio; } audios.push(audio); media.set('audios', audios); } return this.playGlobalAudio(audio, endCallback); },
  "openLink": function(url, name){  if(url == location.href) { return; } var isElectron = (window && window.process && window.process.versions && window.process.versions['electron']) || (navigator && navigator.userAgent && navigator.userAgent.indexOf('Electron') >= 0); if (name == '_blank' && isElectron) { if (url.startsWith('/')) { var r = window.location.href.split('/'); r.pop(); url = r.join('/') + url; } var extension = url.split('.').pop().toLowerCase(); if(extension != 'pdf' || url.startsWith('file://')) { var shell = window.require('electron').shell; shell.openExternal(url); } else { window.open(url, name); } } else if(isElectron && (name == '_top' || name == '_self')) { window.location = url; } else { var newWindow = window.open(url, name); newWindow.focus(); } },
  "initGA": function(){  var sendFunc = function(category, event, label) { ga('send', 'event', category, event, label); }; var media = this.getByClassName('Panorama'); media = media.concat(this.getByClassName('Video360')); media = media.concat(this.getByClassName('Map')); for(var i = 0, countI = media.length; i<countI; ++i){ var m = media[i]; var mediaLabel = m.get('label'); var overlays = this.getOverlays(m); for(var j = 0, countJ = overlays.length; j<countJ; ++j){ var overlay = overlays[j]; var overlayLabel = overlay.get('data') != undefined ? mediaLabel + ' - ' + overlay.get('data')['label'] : mediaLabel; switch(overlay.get('class')) { case 'HotspotPanoramaOverlay': case 'HotspotMapOverlay': var areas = overlay.get('areas'); for (var z = 0; z<areas.length; ++z) { areas[z].bind('click', sendFunc.bind(this, 'Hotspot', 'click', overlayLabel), this); } break; case 'CeilingCapPanoramaOverlay': case 'TripodCapPanoramaOverlay': overlay.bind('click', sendFunc.bind(this, 'Cap', 'click', overlayLabel), this); break; } } } var components = this.getByClassName('Button'); components = components.concat(this.getByClassName('IconButton')); for(var i = 0, countI = components.length; i<countI; ++i){ var c = components[i]; var componentLabel = c.get('data')['name']; c.bind('click', sendFunc.bind(this, 'Skin', 'click', componentLabel), this); } var items = this.getByClassName('PlayListItem'); var media2Item = {}; for(var i = 0, countI = items.length; i<countI; ++i) { var item = items[i]; var media = item.get('media'); if(!(media.get('id') in media2Item)) { item.bind('begin', sendFunc.bind(this, 'Media', 'play', media.get('label')), this); media2Item[media.get('id')] = item; } } }
 },
 "start": "this.init()",
 "horizontalAlign": "left",
 "children": [
  "this.MainViewer",
  "this.Image_A9D18088_8B3E_1672_41D7_D19FBDAD6069",
  "this.Image_A8C11C36_8B3A_6E9E_41C7_F5F7299E18F0",
  "this.Image_A925EE7E_8B3B_EA8E_41D4_03CB2C585C40",
  "this.Image_A8E4314E_8B3A_368E_41CA_3ECA72C4067B"
 ],
 "height": "100%",
 "id": "rootPlayer",
 "width": "100%",
 "overflow": "visible",
 "mouseWheelEnabled": true,
 "class": "Player",
 "borderRadius": 0,
 "minHeight": 20,
 "scrollBarWidth": 10,
 "definitions": [{
 "initialPosition": {
  "yaw": 89.08,
  "class": "PanoramaCameraPosition",
  "pitch": 0.92
 },
 "initialSequence": {
  "class": "PanoramaCameraSequence",
  "movements": [
   {
    "yawSpeed": 7.96,
    "yawDelta": 18.5,
    "class": "DistancePanoramaCameraMovement",
    "easing": "cubic_in"
   },
   {
    "yawSpeed": 7.96,
    "yawDelta": 323,
    "class": "DistancePanoramaCameraMovement",
    "easing": "linear"
   },
   {
    "yawSpeed": 7.96,
    "yawDelta": 18.5,
    "class": "DistancePanoramaCameraMovement",
    "easing": "cubic_out"
   }
  ],
  "restartMovementOnUserInteraction": false
 },
 "id": "camera_844A672B_8AC4_B3DF_41AF_530DB9F3B14A",
 "class": "PanoramaCamera",
 "automaticZoomSpeed": 10
},
{
 "initialPosition": {
  "yaw": 16.09,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 },
 "initialSequence": {
  "class": "PanoramaCameraSequence",
  "movements": [
   {
    "yawSpeed": 7.96,
    "yawDelta": 18.5,
    "class": "DistancePanoramaCameraMovement",
    "easing": "cubic_in"
   },
   {
    "yawSpeed": 7.96,
    "yawDelta": 323,
    "class": "DistancePanoramaCameraMovement",
    "easing": "linear"
   },
   {
    "yawSpeed": 7.96,
    "yawDelta": 18.5,
    "class": "DistancePanoramaCameraMovement",
    "easing": "cubic_out"
   }
  ],
  "restartMovementOnUserInteraction": false
 },
 "id": "camera_85A06450_8AC4_B648_41B3_0EAA6CF8EC7D",
 "class": "PanoramaCamera",
 "automaticZoomSpeed": 10
},
{
 "displayOriginPosition": {
  "yaw": 0,
  "hfov": 165,
  "class": "RotationalCameraDisplayPosition",
  "stereographicFactor": 1,
  "pitch": -90
 },
 "initialPosition": {
  "yaw": 0,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 },
 "initialSequence": {
  "class": "PanoramaCameraSequence",
  "movements": [
   {
    "yawSpeed": 7.96,
    "yawDelta": 18.5,
    "class": "DistancePanoramaCameraMovement",
    "easing": "cubic_in"
   },
   {
    "yawSpeed": 7.96,
    "yawDelta": 323,
    "class": "DistancePanoramaCameraMovement",
    "easing": "linear"
   },
   {
    "yawSpeed": 7.96,
    "yawDelta": 18.5,
    "class": "DistancePanoramaCameraMovement",
    "easing": "cubic_out"
   }
  ],
  "restartMovementOnUserInteraction": false
 },
 "id": "panorama_8C698C0B_873E_2E76_41D9_D763A36BC981_camera",
 "class": "PanoramaCamera",
 "displayMovements": [
  {
   "duration": 1000,
   "class": "TargetRotationalCameraDisplayMovement",
   "easing": "linear"
  },
  {
   "targetPitch": 0,
   "targetStereographicFactor": 0,
   "duration": 3000,
   "class": "TargetRotationalCameraDisplayMovement",
   "easing": "cubic_in_out"
  }
 ],
 "automaticZoomSpeed": 10
},
{
 "frames": [
  {
   "front": {
    "levels": [
     {
      "url": "media/panorama_8D012E2E_874A_2A8E_4191_30904C062B4B_0/f/0/{row}_{column}.jpg",
      "colCount": 5,
      "width": 2560,
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "rowCount": 5,
      "height": 2560
     },
     {
      "url": "media/panorama_8D012E2E_874A_2A8E_4191_30904C062B4B_0/f/1/{row}_{column}.jpg",
      "colCount": 3,
      "width": 1536,
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "rowCount": 3,
      "height": 1536
     },
     {
      "url": "media/panorama_8D012E2E_874A_2A8E_4191_30904C062B4B_0/f/2/{row}_{column}.jpg",
      "colCount": 2,
      "width": 1024,
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_8D012E2E_874A_2A8E_4191_30904C062B4B_0/f/3/{row}_{column}.jpg",
      "colCount": 1,
      "width": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "height": 512
     }
    ],
    "class": "ImageResource"
   },
   "top": {
    "levels": [
     {
      "url": "media/panorama_8D012E2E_874A_2A8E_4191_30904C062B4B_0/u/0/{row}_{column}.jpg",
      "colCount": 5,
      "width": 2560,
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "rowCount": 5,
      "height": 2560
     },
     {
      "url": "media/panorama_8D012E2E_874A_2A8E_4191_30904C062B4B_0/u/1/{row}_{column}.jpg",
      "colCount": 3,
      "width": 1536,
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "rowCount": 3,
      "height": 1536
     },
     {
      "url": "media/panorama_8D012E2E_874A_2A8E_4191_30904C062B4B_0/u/2/{row}_{column}.jpg",
      "colCount": 2,
      "width": 1024,
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_8D012E2E_874A_2A8E_4191_30904C062B4B_0/u/3/{row}_{column}.jpg",
      "colCount": 1,
      "width": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "height": 512
     }
    ],
    "class": "ImageResource"
   },
   "right": {
    "levels": [
     {
      "url": "media/panorama_8D012E2E_874A_2A8E_4191_30904C062B4B_0/r/0/{row}_{column}.jpg",
      "colCount": 5,
      "width": 2560,
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "rowCount": 5,
      "height": 2560
     },
     {
      "url": "media/panorama_8D012E2E_874A_2A8E_4191_30904C062B4B_0/r/1/{row}_{column}.jpg",
      "colCount": 3,
      "width": 1536,
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "rowCount": 3,
      "height": 1536
     },
     {
      "url": "media/panorama_8D012E2E_874A_2A8E_4191_30904C062B4B_0/r/2/{row}_{column}.jpg",
      "colCount": 2,
      "width": 1024,
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_8D012E2E_874A_2A8E_4191_30904C062B4B_0/r/3/{row}_{column}.jpg",
      "colCount": 1,
      "width": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "height": 512
     }
    ],
    "class": "ImageResource"
   },
   "back": {
    "levels": [
     {
      "url": "media/panorama_8D012E2E_874A_2A8E_4191_30904C062B4B_0/b/0/{row}_{column}.jpg",
      "colCount": 5,
      "width": 2560,
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "rowCount": 5,
      "height": 2560
     },
     {
      "url": "media/panorama_8D012E2E_874A_2A8E_4191_30904C062B4B_0/b/1/{row}_{column}.jpg",
      "colCount": 3,
      "width": 1536,
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "rowCount": 3,
      "height": 1536
     },
     {
      "url": "media/panorama_8D012E2E_874A_2A8E_4191_30904C062B4B_0/b/2/{row}_{column}.jpg",
      "colCount": 2,
      "width": 1024,
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_8D012E2E_874A_2A8E_4191_30904C062B4B_0/b/3/{row}_{column}.jpg",
      "colCount": 1,
      "width": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "height": 512
     }
    ],
    "class": "ImageResource"
   },
   "thumbnailUrl": "media/panorama_8D012E2E_874A_2A8E_4191_30904C062B4B_t.jpg",
   "bottom": {
    "levels": [
     {
      "url": "media/panorama_8D012E2E_874A_2A8E_4191_30904C062B4B_0/d/0/{row}_{column}.jpg",
      "colCount": 5,
      "width": 2560,
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "rowCount": 5,
      "height": 2560
     },
     {
      "url": "media/panorama_8D012E2E_874A_2A8E_4191_30904C062B4B_0/d/1/{row}_{column}.jpg",
      "colCount": 3,
      "width": 1536,
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "rowCount": 3,
      "height": 1536
     },
     {
      "url": "media/panorama_8D012E2E_874A_2A8E_4191_30904C062B4B_0/d/2/{row}_{column}.jpg",
      "colCount": 2,
      "width": 1024,
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_8D012E2E_874A_2A8E_4191_30904C062B4B_0/d/3/{row}_{column}.jpg",
      "colCount": 1,
      "width": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "height": 512
     }
    ],
    "class": "ImageResource"
   },
   "class": "CubicPanoramaFrame",
   "left": {
    "levels": [
     {
      "url": "media/panorama_8D012E2E_874A_2A8E_4191_30904C062B4B_0/l/0/{row}_{column}.jpg",
      "colCount": 5,
      "width": 2560,
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "rowCount": 5,
      "height": 2560
     },
     {
      "url": "media/panorama_8D012E2E_874A_2A8E_4191_30904C062B4B_0/l/1/{row}_{column}.jpg",
      "colCount": 3,
      "width": 1536,
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "rowCount": 3,
      "height": 1536
     },
     {
      "url": "media/panorama_8D012E2E_874A_2A8E_4191_30904C062B4B_0/l/2/{row}_{column}.jpg",
      "colCount": 2,
      "width": 1024,
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_8D012E2E_874A_2A8E_4191_30904C062B4B_0/l/3/{row}_{column}.jpg",
      "colCount": 1,
      "width": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "height": 512
     }
    ],
    "class": "ImageResource"
   }
  }
 ],
 "label": "SAM_101_1976",
 "hfovMin": "135%",
 "id": "panorama_8D012E2E_874A_2A8E_4191_30904C062B4B",
 "overlays": [
  "this.panorama_8D012E2E_874A_2A8E_4191_30904C062B4B_tcap0",
  "this.overlay_897F8352_87CA_1A96_41C9_7B12B225809F",
  "this.overlay_88B453E4_87CA_39B3_41DD_7D91C417C235"
 ],
 "partial": false,
 "adjacentPanoramas": [
  {
   "panorama": "this.panorama_8D1FC4A9_8746_1FB2_4199_50FEC28B1F42",
   "class": "AdjacentPanorama"
  },
  {
   "panorama": "this.panorama_8D3214D1_874A_3F92_41B8_DE3A41B87CDE",
   "class": "AdjacentPanorama"
  }
 ],
 "hfov": 360,
 "pitch": 0,
 "class": "Panorama",
 "vfov": 180,
 "thumbnailUrl": "media/panorama_8D012E2E_874A_2A8E_4191_30904C062B4B_t.jpg",
 "hfovMax": 130
},
{
 "initialPosition": {
  "yaw": -95.51,
  "class": "PanoramaCameraPosition",
  "pitch": -5.51
 },
 "initialSequence": {
  "class": "PanoramaCameraSequence",
  "movements": [
   {
    "yawSpeed": 7.96,
    "yawDelta": 18.5,
    "class": "DistancePanoramaCameraMovement",
    "easing": "cubic_in"
   },
   {
    "yawSpeed": 7.96,
    "yawDelta": 323,
    "class": "DistancePanoramaCameraMovement",
    "easing": "linear"
   },
   {
    "yawSpeed": 7.96,
    "yawDelta": 18.5,
    "class": "DistancePanoramaCameraMovement",
    "easing": "cubic_out"
   }
  ],
  "restartMovementOnUserInteraction": false
 },
 "id": "camera_85B5B469_8AC4_B658_41B3_45B1934C5E8C",
 "class": "PanoramaCamera",
 "automaticZoomSpeed": 10
},
{
 "frames": [
  {
   "front": {
    "levels": [
     {
      "url": "media/panorama_8D2E44C5_875A_FFF2_41D2_998B2388C555_0/f/0/{row}_{column}.jpg",
      "colCount": 5,
      "width": 2560,
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "rowCount": 5,
      "height": 2560
     },
     {
      "url": "media/panorama_8D2E44C5_875A_FFF2_41D2_998B2388C555_0/f/1/{row}_{column}.jpg",
      "colCount": 3,
      "width": 1536,
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "rowCount": 3,
      "height": 1536
     },
     {
      "url": "media/panorama_8D2E44C5_875A_FFF2_41D2_998B2388C555_0/f/2/{row}_{column}.jpg",
      "colCount": 2,
      "width": 1024,
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_8D2E44C5_875A_FFF2_41D2_998B2388C555_0/f/3/{row}_{column}.jpg",
      "colCount": 1,
      "width": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "height": 512
     }
    ],
    "class": "ImageResource"
   },
   "top": {
    "levels": [
     {
      "url": "media/panorama_8D2E44C5_875A_FFF2_41D2_998B2388C555_0/u/0/{row}_{column}.jpg",
      "colCount": 5,
      "width": 2560,
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "rowCount": 5,
      "height": 2560
     },
     {
      "url": "media/panorama_8D2E44C5_875A_FFF2_41D2_998B2388C555_0/u/1/{row}_{column}.jpg",
      "colCount": 3,
      "width": 1536,
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "rowCount": 3,
      "height": 1536
     },
     {
      "url": "media/panorama_8D2E44C5_875A_FFF2_41D2_998B2388C555_0/u/2/{row}_{column}.jpg",
      "colCount": 2,
      "width": 1024,
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_8D2E44C5_875A_FFF2_41D2_998B2388C555_0/u/3/{row}_{column}.jpg",
      "colCount": 1,
      "width": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "height": 512
     }
    ],
    "class": "ImageResource"
   },
   "right": {
    "levels": [
     {
      "url": "media/panorama_8D2E44C5_875A_FFF2_41D2_998B2388C555_0/r/0/{row}_{column}.jpg",
      "colCount": 5,
      "width": 2560,
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "rowCount": 5,
      "height": 2560
     },
     {
      "url": "media/panorama_8D2E44C5_875A_FFF2_41D2_998B2388C555_0/r/1/{row}_{column}.jpg",
      "colCount": 3,
      "width": 1536,
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "rowCount": 3,
      "height": 1536
     },
     {
      "url": "media/panorama_8D2E44C5_875A_FFF2_41D2_998B2388C555_0/r/2/{row}_{column}.jpg",
      "colCount": 2,
      "width": 1024,
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_8D2E44C5_875A_FFF2_41D2_998B2388C555_0/r/3/{row}_{column}.jpg",
      "colCount": 1,
      "width": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "height": 512
     }
    ],
    "class": "ImageResource"
   },
   "back": {
    "levels": [
     {
      "url": "media/panorama_8D2E44C5_875A_FFF2_41D2_998B2388C555_0/b/0/{row}_{column}.jpg",
      "colCount": 5,
      "width": 2560,
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "rowCount": 5,
      "height": 2560
     },
     {
      "url": "media/panorama_8D2E44C5_875A_FFF2_41D2_998B2388C555_0/b/1/{row}_{column}.jpg",
      "colCount": 3,
      "width": 1536,
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "rowCount": 3,
      "height": 1536
     },
     {
      "url": "media/panorama_8D2E44C5_875A_FFF2_41D2_998B2388C555_0/b/2/{row}_{column}.jpg",
      "colCount": 2,
      "width": 1024,
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_8D2E44C5_875A_FFF2_41D2_998B2388C555_0/b/3/{row}_{column}.jpg",
      "colCount": 1,
      "width": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "height": 512
     }
    ],
    "class": "ImageResource"
   },
   "thumbnailUrl": "media/panorama_8D2E44C5_875A_FFF2_41D2_998B2388C555_t.jpg",
   "bottom": {
    "levels": [
     {
      "url": "media/panorama_8D2E44C5_875A_FFF2_41D2_998B2388C555_0/d/0/{row}_{column}.jpg",
      "colCount": 5,
      "width": 2560,
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "rowCount": 5,
      "height": 2560
     },
     {
      "url": "media/panorama_8D2E44C5_875A_FFF2_41D2_998B2388C555_0/d/1/{row}_{column}.jpg",
      "colCount": 3,
      "width": 1536,
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "rowCount": 3,
      "height": 1536
     },
     {
      "url": "media/panorama_8D2E44C5_875A_FFF2_41D2_998B2388C555_0/d/2/{row}_{column}.jpg",
      "colCount": 2,
      "width": 1024,
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_8D2E44C5_875A_FFF2_41D2_998B2388C555_0/d/3/{row}_{column}.jpg",
      "colCount": 1,
      "width": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "height": 512
     }
    ],
    "class": "ImageResource"
   },
   "class": "CubicPanoramaFrame",
   "left": {
    "levels": [
     {
      "url": "media/panorama_8D2E44C5_875A_FFF2_41D2_998B2388C555_0/l/0/{row}_{column}.jpg",
      "colCount": 5,
      "width": 2560,
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "rowCount": 5,
      "height": 2560
     },
     {
      "url": "media/panorama_8D2E44C5_875A_FFF2_41D2_998B2388C555_0/l/1/{row}_{column}.jpg",
      "colCount": 3,
      "width": 1536,
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "rowCount": 3,
      "height": 1536
     },
     {
      "url": "media/panorama_8D2E44C5_875A_FFF2_41D2_998B2388C555_0/l/2/{row}_{column}.jpg",
      "colCount": 2,
      "width": 1024,
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_8D2E44C5_875A_FFF2_41D2_998B2388C555_0/l/3/{row}_{column}.jpg",
      "colCount": 1,
      "width": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "height": 512
     }
    ],
    "class": "ImageResource"
   }
  }
 ],
 "label": "SAM_101_1968",
 "hfovMin": "135%",
 "id": "panorama_8D2E44C5_875A_FFF2_41D2_998B2388C555",
 "overlays": [
  "this.panorama_8D2E44C5_875A_FFF2_41D2_998B2388C555_tcap0",
  "this.overlay_89909EA0_873A_2BB2_41C0_DA7C4A5CD9FF",
  "this.overlay_88546360_873A_1AB2_41C8_6C2E0F77D5FD"
 ],
 "partial": false,
 "adjacentPanoramas": [
  {
   "panorama": "this.panorama_8D26F0D5_874A_1792_41C4_D544048ED703",
   "class": "AdjacentPanorama"
  },
  {
   "panorama": "this.panorama_8D342236_875E_1A9E_41D1_D2B4A3232FA4",
   "class": "AdjacentPanorama"
  }
 ],
 "hfov": 360,
 "pitch": 0,
 "class": "Panorama",
 "vfov": 180,
 "thumbnailUrl": "media/panorama_8D2E44C5_875A_FFF2_41D2_998B2388C555_t.jpg",
 "hfovMax": 130
},
{
 "initialPosition": {
  "yaw": 0,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 },
 "initialSequence": {
  "class": "PanoramaCameraSequence",
  "movements": [
   {
    "yawSpeed": 7.96,
    "yawDelta": 18.5,
    "class": "DistancePanoramaCameraMovement",
    "easing": "cubic_in"
   },
   {
    "yawSpeed": 7.96,
    "yawDelta": 323,
    "class": "DistancePanoramaCameraMovement",
    "easing": "linear"
   },
   {
    "yawSpeed": 7.96,
    "yawDelta": 18.5,
    "class": "DistancePanoramaCameraMovement",
    "easing": "cubic_out"
   }
  ],
  "restartMovementOnUserInteraction": false
 },
 "id": "panorama_8D26F0D5_874A_1792_41C4_D544048ED703_camera",
 "class": "PanoramaCamera",
 "automaticZoomSpeed": 10
},
{
 "initialPosition": {
  "yaw": 67.96,
  "class": "PanoramaCameraPosition",
  "pitch": 0.92
 },
 "initialSequence": {
  "class": "PanoramaCameraSequence",
  "movements": [
   {
    "yawSpeed": 7.96,
    "yawDelta": 18.5,
    "class": "DistancePanoramaCameraMovement",
    "easing": "cubic_in"
   },
   {
    "yawSpeed": 7.96,
    "yawDelta": 323,
    "class": "DistancePanoramaCameraMovement",
    "easing": "linear"
   },
   {
    "yawSpeed": 7.96,
    "yawDelta": 18.5,
    "class": "DistancePanoramaCameraMovement",
    "easing": "cubic_out"
   }
  ],
  "restartMovementOnUserInteraction": false
 },
 "id": "camera_8581148C_8AC4_B6D9_41C9_50CCC4198134",
 "class": "PanoramaCamera",
 "automaticZoomSpeed": 10
},
{
 "initialPosition": {
  "yaw": -5.18,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 },
 "initialSequence": {
  "class": "PanoramaCameraSequence",
  "movements": [
   {
    "yawSpeed": 7.96,
    "yawDelta": 18.5,
    "class": "DistancePanoramaCameraMovement",
    "easing": "cubic_in"
   },
   {
    "yawSpeed": 7.96,
    "yawDelta": 323,
    "class": "DistancePanoramaCameraMovement",
    "easing": "linear"
   },
   {
    "yawSpeed": 7.96,
    "yawDelta": 18.5,
    "class": "DistancePanoramaCameraMovement",
    "easing": "cubic_out"
   }
  ],
  "restartMovementOnUserInteraction": false
 },
 "id": "camera_847456DA_8AC4_B278_41DB_2C00BD462215",
 "class": "PanoramaCamera",
 "automaticZoomSpeed": 10
},
{
 "initialPosition": {
  "yaw": 0,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 },
 "initialSequence": {
  "class": "PanoramaCameraSequence",
  "movements": [
   {
    "yawSpeed": 7.96,
    "yawDelta": 18.5,
    "class": "DistancePanoramaCameraMovement",
    "easing": "cubic_in"
   },
   {
    "yawSpeed": 7.96,
    "yawDelta": 323,
    "class": "DistancePanoramaCameraMovement",
    "easing": "linear"
   },
   {
    "yawSpeed": 7.96,
    "yawDelta": 18.5,
    "class": "DistancePanoramaCameraMovement",
    "easing": "cubic_out"
   }
  ],
  "restartMovementOnUserInteraction": false
 },
 "id": "panorama_8D26FEDC_874A_2B92_41BD_9E25154EBA39_camera",
 "class": "PanoramaCamera",
 "automaticZoomSpeed": 10
},
{
 "initialPosition": {
  "yaw": 0,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 },
 "initialSequence": {
  "class": "PanoramaCameraSequence",
  "movements": [
   {
    "yawSpeed": 7.96,
    "yawDelta": 18.5,
    "class": "DistancePanoramaCameraMovement",
    "easing": "cubic_in"
   },
   {
    "yawSpeed": 7.96,
    "yawDelta": 323,
    "class": "DistancePanoramaCameraMovement",
    "easing": "linear"
   },
   {
    "yawSpeed": 7.96,
    "yawDelta": 18.5,
    "class": "DistancePanoramaCameraMovement",
    "easing": "cubic_out"
   }
  ],
  "restartMovementOnUserInteraction": false
 },
 "id": "panorama_8D012E2E_874A_2A8E_4191_30904C062B4B_camera",
 "class": "PanoramaCamera",
 "automaticZoomSpeed": 10
},
{
 "frames": [
  {
   "front": {
    "levels": [
     {
      "url": "media/panorama_8D265541_874A_FEF2_41DE_A0BC495C5419_0/f/0/{row}_{column}.jpg",
      "colCount": 5,
      "width": 2560,
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "rowCount": 5,
      "height": 2560
     },
     {
      "url": "media/panorama_8D265541_874A_FEF2_41DE_A0BC495C5419_0/f/1/{row}_{column}.jpg",
      "colCount": 3,
      "width": 1536,
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "rowCount": 3,
      "height": 1536
     },
     {
      "url": "media/panorama_8D265541_874A_FEF2_41DE_A0BC495C5419_0/f/2/{row}_{column}.jpg",
      "colCount": 2,
      "width": 1024,
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_8D265541_874A_FEF2_41DE_A0BC495C5419_0/f/3/{row}_{column}.jpg",
      "colCount": 1,
      "width": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "height": 512
     }
    ],
    "class": "ImageResource"
   },
   "top": {
    "levels": [
     {
      "url": "media/panorama_8D265541_874A_FEF2_41DE_A0BC495C5419_0/u/0/{row}_{column}.jpg",
      "colCount": 5,
      "width": 2560,
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "rowCount": 5,
      "height": 2560
     },
     {
      "url": "media/panorama_8D265541_874A_FEF2_41DE_A0BC495C5419_0/u/1/{row}_{column}.jpg",
      "colCount": 3,
      "width": 1536,
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "rowCount": 3,
      "height": 1536
     },
     {
      "url": "media/panorama_8D265541_874A_FEF2_41DE_A0BC495C5419_0/u/2/{row}_{column}.jpg",
      "colCount": 2,
      "width": 1024,
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_8D265541_874A_FEF2_41DE_A0BC495C5419_0/u/3/{row}_{column}.jpg",
      "colCount": 1,
      "width": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "height": 512
     }
    ],
    "class": "ImageResource"
   },
   "right": {
    "levels": [
     {
      "url": "media/panorama_8D265541_874A_FEF2_41DE_A0BC495C5419_0/r/0/{row}_{column}.jpg",
      "colCount": 5,
      "width": 2560,
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "rowCount": 5,
      "height": 2560
     },
     {
      "url": "media/panorama_8D265541_874A_FEF2_41DE_A0BC495C5419_0/r/1/{row}_{column}.jpg",
      "colCount": 3,
      "width": 1536,
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "rowCount": 3,
      "height": 1536
     },
     {
      "url": "media/panorama_8D265541_874A_FEF2_41DE_A0BC495C5419_0/r/2/{row}_{column}.jpg",
      "colCount": 2,
      "width": 1024,
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_8D265541_874A_FEF2_41DE_A0BC495C5419_0/r/3/{row}_{column}.jpg",
      "colCount": 1,
      "width": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "height": 512
     }
    ],
    "class": "ImageResource"
   },
   "back": {
    "levels": [
     {
      "url": "media/panorama_8D265541_874A_FEF2_41DE_A0BC495C5419_0/b/0/{row}_{column}.jpg",
      "colCount": 5,
      "width": 2560,
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "rowCount": 5,
      "height": 2560
     },
     {
      "url": "media/panorama_8D265541_874A_FEF2_41DE_A0BC495C5419_0/b/1/{row}_{column}.jpg",
      "colCount": 3,
      "width": 1536,
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "rowCount": 3,
      "height": 1536
     },
     {
      "url": "media/panorama_8D265541_874A_FEF2_41DE_A0BC495C5419_0/b/2/{row}_{column}.jpg",
      "colCount": 2,
      "width": 1024,
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_8D265541_874A_FEF2_41DE_A0BC495C5419_0/b/3/{row}_{column}.jpg",
      "colCount": 1,
      "width": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "height": 512
     }
    ],
    "class": "ImageResource"
   },
   "thumbnailUrl": "media/panorama_8D265541_874A_FEF2_41DE_A0BC495C5419_t.jpg",
   "bottom": {
    "levels": [
     {
      "url": "media/panorama_8D265541_874A_FEF2_41DE_A0BC495C5419_0/d/0/{row}_{column}.jpg",
      "colCount": 5,
      "width": 2560,
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "rowCount": 5,
      "height": 2560
     },
     {
      "url": "media/panorama_8D265541_874A_FEF2_41DE_A0BC495C5419_0/d/1/{row}_{column}.jpg",
      "colCount": 3,
      "width": 1536,
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "rowCount": 3,
      "height": 1536
     },
     {
      "url": "media/panorama_8D265541_874A_FEF2_41DE_A0BC495C5419_0/d/2/{row}_{column}.jpg",
      "colCount": 2,
      "width": 1024,
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_8D265541_874A_FEF2_41DE_A0BC495C5419_0/d/3/{row}_{column}.jpg",
      "colCount": 1,
      "width": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "height": 512
     }
    ],
    "class": "ImageResource"
   },
   "class": "CubicPanoramaFrame",
   "left": {
    "levels": [
     {
      "url": "media/panorama_8D265541_874A_FEF2_41DE_A0BC495C5419_0/l/0/{row}_{column}.jpg",
      "colCount": 5,
      "width": 2560,
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "rowCount": 5,
      "height": 2560
     },
     {
      "url": "media/panorama_8D265541_874A_FEF2_41DE_A0BC495C5419_0/l/1/{row}_{column}.jpg",
      "colCount": 3,
      "width": 1536,
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "rowCount": 3,
      "height": 1536
     },
     {
      "url": "media/panorama_8D265541_874A_FEF2_41DE_A0BC495C5419_0/l/2/{row}_{column}.jpg",
      "colCount": 2,
      "width": 1024,
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_8D265541_874A_FEF2_41DE_A0BC495C5419_0/l/3/{row}_{column}.jpg",
      "colCount": 1,
      "width": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "height": 512
     }
    ],
    "class": "ImageResource"
   }
  }
 ],
 "label": "SAM_101_1964",
 "hfovMin": "135%",
 "id": "panorama_8D265541_874A_FEF2_41DE_A0BC495C5419",
 "overlays": [
  "this.panorama_8D265541_874A_FEF2_41DE_A0BC495C5419_tcap0",
  "this.overlay_884EC89B_873E_1795_41C9_6F868FC8E640",
  "this.overlay_8811695B_873E_3695_41D7_969B5A4F1D77"
 ],
 "partial": false,
 "adjacentPanoramas": [
  {
   "panorama": "this.panorama_8D330B1E_874E_6A8E_41D2_0A89F6F28F55",
   "class": "AdjacentPanorama"
  },
  {
   "panorama": "this.panorama_8D349E28_875A_2AB3_4191_8B7C205E4B8B",
   "class": "AdjacentPanorama"
  }
 ],
 "hfov": 360,
 "pitch": 0,
 "class": "Panorama",
 "vfov": 180,
 "thumbnailUrl": "media/panorama_8D265541_874A_FEF2_41DE_A0BC495C5419_t.jpg",
 "hfovMax": 130
},
{
 "initialPosition": {
  "yaw": -92.76,
  "class": "PanoramaCameraPosition",
  "pitch": -4.59
 },
 "initialSequence": {
  "class": "PanoramaCameraSequence",
  "movements": [
   {
    "yawSpeed": 7.96,
    "yawDelta": 18.5,
    "class": "DistancePanoramaCameraMovement",
    "easing": "cubic_in"
   },
   {
    "yawSpeed": 7.96,
    "yawDelta": 323,
    "class": "DistancePanoramaCameraMovement",
    "easing": "linear"
   },
   {
    "yawSpeed": 7.96,
    "yawDelta": 18.5,
    "class": "DistancePanoramaCameraMovement",
    "easing": "cubic_out"
   }
  ],
  "restartMovementOnUserInteraction": false
 },
 "id": "camera_9AB4564E_8AC4_B258_41D2_09CBA9E7921C",
 "class": "PanoramaCamera",
 "automaticZoomSpeed": 10
},
{
 "initialPosition": {
  "yaw": 0,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 },
 "initialSequence": {
  "class": "PanoramaCameraSequence",
  "movements": [
   {
    "yawSpeed": 7.96,
    "yawDelta": 18.5,
    "class": "DistancePanoramaCameraMovement",
    "easing": "cubic_in"
   },
   {
    "yawSpeed": 7.96,
    "yawDelta": 323,
    "class": "DistancePanoramaCameraMovement",
    "easing": "linear"
   },
   {
    "yawSpeed": 7.96,
    "yawDelta": 18.5,
    "class": "DistancePanoramaCameraMovement",
    "easing": "cubic_out"
   }
  ],
  "restartMovementOnUserInteraction": false
 },
 "id": "panorama_8D3FB7D2_877A_1996_41D4_7689BB9D7D11_camera",
 "class": "PanoramaCamera",
 "automaticZoomSpeed": 10
},
{
 "initialPosition": {
  "yaw": 0,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 },
 "initialSequence": {
  "class": "PanoramaCameraSequence",
  "movements": [
   {
    "yawSpeed": 7.96,
    "yawDelta": 18.5,
    "class": "DistancePanoramaCameraMovement",
    "easing": "cubic_in"
   },
   {
    "yawSpeed": 7.96,
    "yawDelta": 323,
    "class": "DistancePanoramaCameraMovement",
    "easing": "linear"
   },
   {
    "yawSpeed": 7.96,
    "yawDelta": 18.5,
    "class": "DistancePanoramaCameraMovement",
    "easing": "cubic_out"
   }
  ],
  "restartMovementOnUserInteraction": false
 },
 "id": "panorama_8D277116_877E_F69E_41DF_02AF33F8B702_camera",
 "class": "PanoramaCamera",
 "automaticZoomSpeed": 10
},
{
 "frames": [
  {
   "front": {
    "levels": [
     {
      "url": "media/panorama_8D342236_875E_1A9E_41D1_D2B4A3232FA4_0/f/0/{row}_{column}.jpg",
      "colCount": 5,
      "width": 2560,
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "rowCount": 5,
      "height": 2560
     },
     {
      "url": "media/panorama_8D342236_875E_1A9E_41D1_D2B4A3232FA4_0/f/1/{row}_{column}.jpg",
      "colCount": 3,
      "width": 1536,
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "rowCount": 3,
      "height": 1536
     },
     {
      "url": "media/panorama_8D342236_875E_1A9E_41D1_D2B4A3232FA4_0/f/2/{row}_{column}.jpg",
      "colCount": 2,
      "width": 1024,
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_8D342236_875E_1A9E_41D1_D2B4A3232FA4_0/f/3/{row}_{column}.jpg",
      "colCount": 1,
      "width": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "height": 512
     }
    ],
    "class": "ImageResource"
   },
   "top": {
    "levels": [
     {
      "url": "media/panorama_8D342236_875E_1A9E_41D1_D2B4A3232FA4_0/u/0/{row}_{column}.jpg",
      "colCount": 5,
      "width": 2560,
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "rowCount": 5,
      "height": 2560
     },
     {
      "url": "media/panorama_8D342236_875E_1A9E_41D1_D2B4A3232FA4_0/u/1/{row}_{column}.jpg",
      "colCount": 3,
      "width": 1536,
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "rowCount": 3,
      "height": 1536
     },
     {
      "url": "media/panorama_8D342236_875E_1A9E_41D1_D2B4A3232FA4_0/u/2/{row}_{column}.jpg",
      "colCount": 2,
      "width": 1024,
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_8D342236_875E_1A9E_41D1_D2B4A3232FA4_0/u/3/{row}_{column}.jpg",
      "colCount": 1,
      "width": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "height": 512
     }
    ],
    "class": "ImageResource"
   },
   "right": {
    "levels": [
     {
      "url": "media/panorama_8D342236_875E_1A9E_41D1_D2B4A3232FA4_0/r/0/{row}_{column}.jpg",
      "colCount": 5,
      "width": 2560,
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "rowCount": 5,
      "height": 2560
     },
     {
      "url": "media/panorama_8D342236_875E_1A9E_41D1_D2B4A3232FA4_0/r/1/{row}_{column}.jpg",
      "colCount": 3,
      "width": 1536,
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "rowCount": 3,
      "height": 1536
     },
     {
      "url": "media/panorama_8D342236_875E_1A9E_41D1_D2B4A3232FA4_0/r/2/{row}_{column}.jpg",
      "colCount": 2,
      "width": 1024,
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_8D342236_875E_1A9E_41D1_D2B4A3232FA4_0/r/3/{row}_{column}.jpg",
      "colCount": 1,
      "width": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "height": 512
     }
    ],
    "class": "ImageResource"
   },
   "back": {
    "levels": [
     {
      "url": "media/panorama_8D342236_875E_1A9E_41D1_D2B4A3232FA4_0/b/0/{row}_{column}.jpg",
      "colCount": 5,
      "width": 2560,
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "rowCount": 5,
      "height": 2560
     },
     {
      "url": "media/panorama_8D342236_875E_1A9E_41D1_D2B4A3232FA4_0/b/1/{row}_{column}.jpg",
      "colCount": 3,
      "width": 1536,
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "rowCount": 3,
      "height": 1536
     },
     {
      "url": "media/panorama_8D342236_875E_1A9E_41D1_D2B4A3232FA4_0/b/2/{row}_{column}.jpg",
      "colCount": 2,
      "width": 1024,
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_8D342236_875E_1A9E_41D1_D2B4A3232FA4_0/b/3/{row}_{column}.jpg",
      "colCount": 1,
      "width": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "height": 512
     }
    ],
    "class": "ImageResource"
   },
   "thumbnailUrl": "media/panorama_8D342236_875E_1A9E_41D1_D2B4A3232FA4_t.jpg",
   "bottom": {
    "levels": [
     {
      "url": "media/panorama_8D342236_875E_1A9E_41D1_D2B4A3232FA4_0/d/0/{row}_{column}.jpg",
      "colCount": 5,
      "width": 2560,
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "rowCount": 5,
      "height": 2560
     },
     {
      "url": "media/panorama_8D342236_875E_1A9E_41D1_D2B4A3232FA4_0/d/1/{row}_{column}.jpg",
      "colCount": 3,
      "width": 1536,
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "rowCount": 3,
      "height": 1536
     },
     {
      "url": "media/panorama_8D342236_875E_1A9E_41D1_D2B4A3232FA4_0/d/2/{row}_{column}.jpg",
      "colCount": 2,
      "width": 1024,
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_8D342236_875E_1A9E_41D1_D2B4A3232FA4_0/d/3/{row}_{column}.jpg",
      "colCount": 1,
      "width": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "height": 512
     }
    ],
    "class": "ImageResource"
   },
   "class": "CubicPanoramaFrame",
   "left": {
    "levels": [
     {
      "url": "media/panorama_8D342236_875E_1A9E_41D1_D2B4A3232FA4_0/l/0/{row}_{column}.jpg",
      "colCount": 5,
      "width": 2560,
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "rowCount": 5,
      "height": 2560
     },
     {
      "url": "media/panorama_8D342236_875E_1A9E_41D1_D2B4A3232FA4_0/l/1/{row}_{column}.jpg",
      "colCount": 3,
      "width": 1536,
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "rowCount": 3,
      "height": 1536
     },
     {
      "url": "media/panorama_8D342236_875E_1A9E_41D1_D2B4A3232FA4_0/l/2/{row}_{column}.jpg",
      "colCount": 2,
      "width": 1024,
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_8D342236_875E_1A9E_41D1_D2B4A3232FA4_0/l/3/{row}_{column}.jpg",
      "colCount": 1,
      "width": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "height": 512
     }
    ],
    "class": "ImageResource"
   }
  }
 ],
 "label": "SAM_101_1967",
 "hfovMin": "135%",
 "id": "panorama_8D342236_875E_1A9E_41D1_D2B4A3232FA4",
 "overlays": [
  "this.panorama_8D342236_875E_1A9E_41D1_D2B4A3232FA4_tcap0",
  "this.overlay_898C37F3_873A_1996_41DA_3B68BF1B63BE",
  "this.overlay_8853BAA3_873A_2BB5_41E0_2A2226668E4E",
  "this.overlay_8823E949_873A_16F2_41D2_2F1583895AEF"
 ],
 "partial": false,
 "adjacentPanoramas": [
  {
   "yaw": 174.82,
   "class": "AdjacentPanorama",
   "backwardYaw": -163.91,
   "panorama": "this.panorama_8D2AB845_875A_36FD_41C5_7712FAF92241",
   "distance": 1
  },
  {
   "panorama": "this.panorama_8D2E44C5_875A_FFF2_41D2_998B2388C555",
   "class": "AdjacentPanorama"
  },
  {
   "panorama": "this.panorama_8D3FB7D2_877A_1996_41D4_7689BB9D7D11",
   "class": "AdjacentPanorama"
  }
 ],
 "hfov": 360,
 "pitch": 0,
 "class": "Panorama",
 "vfov": 180,
 "thumbnailUrl": "media/panorama_8D342236_875E_1A9E_41D1_D2B4A3232FA4_t.jpg",
 "hfovMax": 130
},
{
 "initialPosition": {
  "yaw": -166.22,
  "class": "PanoramaCameraPosition",
  "pitch": 5.51
 },
 "initialSequence": {
  "class": "PanoramaCameraSequence",
  "movements": [
   {
    "yawSpeed": 7.96,
    "yawDelta": 18.5,
    "class": "DistancePanoramaCameraMovement",
    "easing": "cubic_in"
   },
   {
    "yawSpeed": 7.96,
    "yawDelta": 323,
    "class": "DistancePanoramaCameraMovement",
    "easing": "linear"
   },
   {
    "yawSpeed": 7.96,
    "yawDelta": 18.5,
    "class": "DistancePanoramaCameraMovement",
    "easing": "cubic_out"
   }
  ],
  "restartMovementOnUserInteraction": false
 },
 "id": "camera_859484A0_8AC4_B6C8_41E0_350D6EFFC644",
 "class": "PanoramaCamera",
 "automaticZoomSpeed": 10
},
{
 "initialPosition": {
  "yaw": 164.39,
  "class": "PanoramaCameraPosition",
  "pitch": -5.51
 },
 "initialSequence": {
  "class": "PanoramaCameraSequence",
  "movements": [
   {
    "yawSpeed": 7.96,
    "yawDelta": 18.5,
    "class": "DistancePanoramaCameraMovement",
    "easing": "cubic_in"
   },
   {
    "yawSpeed": 7.96,
    "yawDelta": 323,
    "class": "DistancePanoramaCameraMovement",
    "easing": "linear"
   },
   {
    "yawSpeed": 7.96,
    "yawDelta": 18.5,
    "class": "DistancePanoramaCameraMovement",
    "easing": "cubic_out"
   }
  ],
  "restartMovementOnUserInteraction": false
 },
 "id": "camera_845F4748_8AC4_B259_41CF_26C1BA22026D",
 "class": "PanoramaCamera",
 "automaticZoomSpeed": 10
},
{
 "initialPosition": {
  "yaw": 0,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 },
 "initialSequence": {
  "class": "PanoramaCameraSequence",
  "movements": [
   {
    "yawSpeed": 7.96,
    "yawDelta": 18.5,
    "class": "DistancePanoramaCameraMovement",
    "easing": "cubic_in"
   },
   {
    "yawSpeed": 7.96,
    "yawDelta": 323,
    "class": "DistancePanoramaCameraMovement",
    "easing": "linear"
   },
   {
    "yawSpeed": 7.96,
    "yawDelta": 18.5,
    "class": "DistancePanoramaCameraMovement",
    "easing": "cubic_out"
   }
  ],
  "restartMovementOnUserInteraction": false
 },
 "id": "panorama_8D265541_874A_FEF2_41DE_A0BC495C5419_camera",
 "class": "PanoramaCamera",
 "automaticZoomSpeed": 10
},
{
 "initialPosition": {
  "yaw": 0,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 },
 "initialSequence": {
  "class": "PanoramaCameraSequence",
  "movements": [
   {
    "yawSpeed": 7.96,
    "yawDelta": 18.5,
    "class": "DistancePanoramaCameraMovement",
    "easing": "cubic_in"
   },
   {
    "yawSpeed": 7.96,
    "yawDelta": 323,
    "class": "DistancePanoramaCameraMovement",
    "easing": "linear"
   },
   {
    "yawSpeed": 7.96,
    "yawDelta": 18.5,
    "class": "DistancePanoramaCameraMovement",
    "easing": "cubic_out"
   }
  ],
  "restartMovementOnUserInteraction": false
 },
 "id": "panorama_8D2AB845_875A_36FD_41C5_7712FAF92241_camera",
 "class": "PanoramaCamera",
 "automaticZoomSpeed": 10
},
{
 "initialPosition": {
  "yaw": 95.51,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 },
 "initialSequence": {
  "class": "PanoramaCameraSequence",
  "movements": [
   {
    "yawSpeed": 7.96,
    "yawDelta": 18.5,
    "class": "DistancePanoramaCameraMovement",
    "easing": "cubic_in"
   },
   {
    "yawSpeed": 7.96,
    "yawDelta": 323,
    "class": "DistancePanoramaCameraMovement",
    "easing": "linear"
   },
   {
    "yawSpeed": 7.96,
    "yawDelta": 18.5,
    "class": "DistancePanoramaCameraMovement",
    "easing": "cubic_out"
   }
  ],
  "restartMovementOnUserInteraction": false
 },
 "id": "camera_857005FF_8AC4_B637_41D5_5E4EA1E6D842",
 "class": "PanoramaCamera",
 "automaticZoomSpeed": 10
},
{
 "initialPosition": {
  "yaw": 177.24,
  "class": "PanoramaCameraPosition",
  "pitch": -8.27
 },
 "initialSequence": {
  "class": "PanoramaCameraSequence",
  "movements": [
   {
    "yawSpeed": 7.96,
    "yawDelta": 18.5,
    "class": "DistancePanoramaCameraMovement",
    "easing": "cubic_in"
   },
   {
    "yawSpeed": 7.96,
    "yawDelta": 323,
    "class": "DistancePanoramaCameraMovement",
    "easing": "linear"
   },
   {
    "yawSpeed": 7.96,
    "yawDelta": 18.5,
    "class": "DistancePanoramaCameraMovement",
    "easing": "cubic_out"
   }
  ],
  "restartMovementOnUserInteraction": false
 },
 "id": "camera_852B555E_8AC4_B678_41B9_48AF9AD919B6",
 "class": "PanoramaCamera",
 "automaticZoomSpeed": 10
},
{
 "frames": [
  {
   "front": {
    "levels": [
     {
      "url": "media/panorama_8D3CFB4B_877A_6AF6_41CB_7F0920056CFD_0/f/0/{row}_{column}.jpg",
      "colCount": 5,
      "width": 2560,
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "rowCount": 5,
      "height": 2560
     },
     {
      "url": "media/panorama_8D3CFB4B_877A_6AF6_41CB_7F0920056CFD_0/f/1/{row}_{column}.jpg",
      "colCount": 3,
      "width": 1536,
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "rowCount": 3,
      "height": 1536
     },
     {
      "url": "media/panorama_8D3CFB4B_877A_6AF6_41CB_7F0920056CFD_0/f/2/{row}_{column}.jpg",
      "colCount": 2,
      "width": 1024,
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_8D3CFB4B_877A_6AF6_41CB_7F0920056CFD_0/f/3/{row}_{column}.jpg",
      "colCount": 1,
      "width": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "height": 512
     }
    ],
    "class": "ImageResource"
   },
   "top": {
    "levels": [
     {
      "url": "media/panorama_8D3CFB4B_877A_6AF6_41CB_7F0920056CFD_0/u/0/{row}_{column}.jpg",
      "colCount": 5,
      "width": 2560,
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "rowCount": 5,
      "height": 2560
     },
     {
      "url": "media/panorama_8D3CFB4B_877A_6AF6_41CB_7F0920056CFD_0/u/1/{row}_{column}.jpg",
      "colCount": 3,
      "width": 1536,
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "rowCount": 3,
      "height": 1536
     },
     {
      "url": "media/panorama_8D3CFB4B_877A_6AF6_41CB_7F0920056CFD_0/u/2/{row}_{column}.jpg",
      "colCount": 2,
      "width": 1024,
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_8D3CFB4B_877A_6AF6_41CB_7F0920056CFD_0/u/3/{row}_{column}.jpg",
      "colCount": 1,
      "width": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "height": 512
     }
    ],
    "class": "ImageResource"
   },
   "right": {
    "levels": [
     {
      "url": "media/panorama_8D3CFB4B_877A_6AF6_41CB_7F0920056CFD_0/r/0/{row}_{column}.jpg",
      "colCount": 5,
      "width": 2560,
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "rowCount": 5,
      "height": 2560
     },
     {
      "url": "media/panorama_8D3CFB4B_877A_6AF6_41CB_7F0920056CFD_0/r/1/{row}_{column}.jpg",
      "colCount": 3,
      "width": 1536,
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "rowCount": 3,
      "height": 1536
     },
     {
      "url": "media/panorama_8D3CFB4B_877A_6AF6_41CB_7F0920056CFD_0/r/2/{row}_{column}.jpg",
      "colCount": 2,
      "width": 1024,
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_8D3CFB4B_877A_6AF6_41CB_7F0920056CFD_0/r/3/{row}_{column}.jpg",
      "colCount": 1,
      "width": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "height": 512
     }
    ],
    "class": "ImageResource"
   },
   "back": {
    "levels": [
     {
      "url": "media/panorama_8D3CFB4B_877A_6AF6_41CB_7F0920056CFD_0/b/0/{row}_{column}.jpg",
      "colCount": 5,
      "width": 2560,
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "rowCount": 5,
      "height": 2560
     },
     {
      "url": "media/panorama_8D3CFB4B_877A_6AF6_41CB_7F0920056CFD_0/b/1/{row}_{column}.jpg",
      "colCount": 3,
      "width": 1536,
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "rowCount": 3,
      "height": 1536
     },
     {
      "url": "media/panorama_8D3CFB4B_877A_6AF6_41CB_7F0920056CFD_0/b/2/{row}_{column}.jpg",
      "colCount": 2,
      "width": 1024,
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_8D3CFB4B_877A_6AF6_41CB_7F0920056CFD_0/b/3/{row}_{column}.jpg",
      "colCount": 1,
      "width": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "height": 512
     }
    ],
    "class": "ImageResource"
   },
   "thumbnailUrl": "media/panorama_8D3CFB4B_877A_6AF6_41CB_7F0920056CFD_t.jpg",
   "bottom": {
    "levels": [
     {
      "url": "media/panorama_8D3CFB4B_877A_6AF6_41CB_7F0920056CFD_0/d/0/{row}_{column}.jpg",
      "colCount": 5,
      "width": 2560,
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "rowCount": 5,
      "height": 2560
     },
     {
      "url": "media/panorama_8D3CFB4B_877A_6AF6_41CB_7F0920056CFD_0/d/1/{row}_{column}.jpg",
      "colCount": 3,
      "width": 1536,
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "rowCount": 3,
      "height": 1536
     },
     {
      "url": "media/panorama_8D3CFB4B_877A_6AF6_41CB_7F0920056CFD_0/d/2/{row}_{column}.jpg",
      "colCount": 2,
      "width": 1024,
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_8D3CFB4B_877A_6AF6_41CB_7F0920056CFD_0/d/3/{row}_{column}.jpg",
      "colCount": 1,
      "width": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "height": 512
     }
    ],
    "class": "ImageResource"
   },
   "class": "CubicPanoramaFrame",
   "left": {
    "levels": [
     {
      "url": "media/panorama_8D3CFB4B_877A_6AF6_41CB_7F0920056CFD_0/l/0/{row}_{column}.jpg",
      "colCount": 5,
      "width": 2560,
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "rowCount": 5,
      "height": 2560
     },
     {
      "url": "media/panorama_8D3CFB4B_877A_6AF6_41CB_7F0920056CFD_0/l/1/{row}_{column}.jpg",
      "colCount": 3,
      "width": 1536,
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "rowCount": 3,
      "height": 1536
     },
     {
      "url": "media/panorama_8D3CFB4B_877A_6AF6_41CB_7F0920056CFD_0/l/2/{row}_{column}.jpg",
      "colCount": 2,
      "width": 1024,
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_8D3CFB4B_877A_6AF6_41CB_7F0920056CFD_0/l/3/{row}_{column}.jpg",
      "colCount": 1,
      "width": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "height": 512
     }
    ],
    "class": "ImageResource"
   }
  }
 ],
 "label": "SAM_101_1974",
 "hfovMin": "135%",
 "id": "panorama_8D3CFB4B_877A_6AF6_41CB_7F0920056CFD",
 "overlays": [
  "this.panorama_8D3CFB4B_877A_6AF6_41CB_7F0920056CFD_tcap0",
  "this.overlay_897C7EB3_87C6_6B96_41DE_427A34916BB3",
  "this.overlay_88B62037_87C6_169D_41D6_A95E677E3698"
 ],
 "partial": false,
 "adjacentPanoramas": [
  {
   "panorama": "this.panorama_8D1FC4A9_8746_1FB2_4199_50FEC28B1F42",
   "class": "AdjacentPanorama"
  },
  {
   "panorama": "this.panorama_8D277116_877E_F69E_41DF_02AF33F8B702",
   "class": "AdjacentPanorama"
  }
 ],
 "hfov": 360,
 "pitch": 0,
 "class": "Panorama",
 "vfov": 180,
 "thumbnailUrl": "media/panorama_8D3CFB4B_877A_6AF6_41CB_7F0920056CFD_t.jpg",
 "hfovMax": 130
},
{
 "initialPosition": {
  "yaw": 97.35,
  "class": "PanoramaCameraPosition",
  "pitch": -11.02
 },
 "initialSequence": {
  "class": "PanoramaCameraSequence",
  "movements": [
   {
    "yawSpeed": 7.96,
    "yawDelta": 18.5,
    "class": "DistancePanoramaCameraMovement",
    "easing": "cubic_in"
   },
   {
    "yawSpeed": 7.96,
    "yawDelta": 323,
    "class": "DistancePanoramaCameraMovement",
    "easing": "linear"
   },
   {
    "yawSpeed": 7.96,
    "yawDelta": 18.5,
    "class": "DistancePanoramaCameraMovement",
    "easing": "cubic_out"
   }
  ],
  "restartMovementOnUserInteraction": false
 },
 "id": "camera_85A5D75C_8AC4_B278_41AE_ECA05E88BA01",
 "class": "PanoramaCamera",
 "automaticZoomSpeed": 10
},
{
 "initialPosition": {
  "yaw": 0,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 },
 "initialSequence": {
  "class": "PanoramaCameraSequence",
  "movements": [
   {
    "yawSpeed": 7.96,
    "yawDelta": 18.5,
    "class": "DistancePanoramaCameraMovement",
    "easing": "cubic_in"
   },
   {
    "yawSpeed": 7.96,
    "yawDelta": 323,
    "class": "DistancePanoramaCameraMovement",
    "easing": "linear"
   },
   {
    "yawSpeed": 7.96,
    "yawDelta": 18.5,
    "class": "DistancePanoramaCameraMovement",
    "easing": "cubic_out"
   }
  ],
  "restartMovementOnUserInteraction": false
 },
 "id": "panorama_8D21215C_8746_3692_4179_F0E8FC89F914_camera",
 "class": "PanoramaCamera",
 "automaticZoomSpeed": 10
},
{
 "initialPosition": {
  "yaw": -71.63,
  "class": "PanoramaCameraPosition",
  "pitch": -4.59
 },
 "initialSequence": {
  "class": "PanoramaCameraSequence",
  "movements": [
   {
    "yawSpeed": 7.96,
    "yawDelta": 18.5,
    "class": "DistancePanoramaCameraMovement",
    "easing": "cubic_in"
   },
   {
    "yawSpeed": 7.96,
    "yawDelta": 323,
    "class": "DistancePanoramaCameraMovement",
    "easing": "linear"
   },
   {
    "yawSpeed": 7.96,
    "yawDelta": 18.5,
    "class": "DistancePanoramaCameraMovement",
    "easing": "cubic_out"
   }
  ],
  "restartMovementOnUserInteraction": false
 },
 "id": "camera_8464D69E_8AC4_B2F8_41D3_02CA7ECBDEE3",
 "class": "PanoramaCamera",
 "automaticZoomSpeed": 10
},
{
 "frames": [
  {
   "front": {
    "levels": [
     {
      "url": "media/panorama_8D26FEDC_874A_2B92_41BD_9E25154EBA39_0/f/0/{row}_{column}.jpg",
      "colCount": 5,
      "width": 2560,
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "rowCount": 5,
      "height": 2560
     },
     {
      "url": "media/panorama_8D26FEDC_874A_2B92_41BD_9E25154EBA39_0/f/1/{row}_{column}.jpg",
      "colCount": 3,
      "width": 1536,
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "rowCount": 3,
      "height": 1536
     },
     {
      "url": "media/panorama_8D26FEDC_874A_2B92_41BD_9E25154EBA39_0/f/2/{row}_{column}.jpg",
      "colCount": 2,
      "width": 1024,
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_8D26FEDC_874A_2B92_41BD_9E25154EBA39_0/f/3/{row}_{column}.jpg",
      "colCount": 1,
      "width": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "height": 512
     }
    ],
    "class": "ImageResource"
   },
   "top": {
    "levels": [
     {
      "url": "media/panorama_8D26FEDC_874A_2B92_41BD_9E25154EBA39_0/u/0/{row}_{column}.jpg",
      "colCount": 5,
      "width": 2560,
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "rowCount": 5,
      "height": 2560
     },
     {
      "url": "media/panorama_8D26FEDC_874A_2B92_41BD_9E25154EBA39_0/u/1/{row}_{column}.jpg",
      "colCount": 3,
      "width": 1536,
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "rowCount": 3,
      "height": 1536
     },
     {
      "url": "media/panorama_8D26FEDC_874A_2B92_41BD_9E25154EBA39_0/u/2/{row}_{column}.jpg",
      "colCount": 2,
      "width": 1024,
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_8D26FEDC_874A_2B92_41BD_9E25154EBA39_0/u/3/{row}_{column}.jpg",
      "colCount": 1,
      "width": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "height": 512
     }
    ],
    "class": "ImageResource"
   },
   "right": {
    "levels": [
     {
      "url": "media/panorama_8D26FEDC_874A_2B92_41BD_9E25154EBA39_0/r/0/{row}_{column}.jpg",
      "colCount": 5,
      "width": 2560,
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "rowCount": 5,
      "height": 2560
     },
     {
      "url": "media/panorama_8D26FEDC_874A_2B92_41BD_9E25154EBA39_0/r/1/{row}_{column}.jpg",
      "colCount": 3,
      "width": 1536,
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "rowCount": 3,
      "height": 1536
     },
     {
      "url": "media/panorama_8D26FEDC_874A_2B92_41BD_9E25154EBA39_0/r/2/{row}_{column}.jpg",
      "colCount": 2,
      "width": 1024,
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_8D26FEDC_874A_2B92_41BD_9E25154EBA39_0/r/3/{row}_{column}.jpg",
      "colCount": 1,
      "width": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "height": 512
     }
    ],
    "class": "ImageResource"
   },
   "back": {
    "levels": [
     {
      "url": "media/panorama_8D26FEDC_874A_2B92_41BD_9E25154EBA39_0/b/0/{row}_{column}.jpg",
      "colCount": 5,
      "width": 2560,
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "rowCount": 5,
      "height": 2560
     },
     {
      "url": "media/panorama_8D26FEDC_874A_2B92_41BD_9E25154EBA39_0/b/1/{row}_{column}.jpg",
      "colCount": 3,
      "width": 1536,
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "rowCount": 3,
      "height": 1536
     },
     {
      "url": "media/panorama_8D26FEDC_874A_2B92_41BD_9E25154EBA39_0/b/2/{row}_{column}.jpg",
      "colCount": 2,
      "width": 1024,
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_8D26FEDC_874A_2B92_41BD_9E25154EBA39_0/b/3/{row}_{column}.jpg",
      "colCount": 1,
      "width": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "height": 512
     }
    ],
    "class": "ImageResource"
   },
   "thumbnailUrl": "media/panorama_8D26FEDC_874A_2B92_41BD_9E25154EBA39_t.jpg",
   "bottom": {
    "levels": [
     {
      "url": "media/panorama_8D26FEDC_874A_2B92_41BD_9E25154EBA39_0/d/0/{row}_{column}.jpg",
      "colCount": 5,
      "width": 2560,
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "rowCount": 5,
      "height": 2560
     },
     {
      "url": "media/panorama_8D26FEDC_874A_2B92_41BD_9E25154EBA39_0/d/1/{row}_{column}.jpg",
      "colCount": 3,
      "width": 1536,
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "rowCount": 3,
      "height": 1536
     },
     {
      "url": "media/panorama_8D26FEDC_874A_2B92_41BD_9E25154EBA39_0/d/2/{row}_{column}.jpg",
      "colCount": 2,
      "width": 1024,
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_8D26FEDC_874A_2B92_41BD_9E25154EBA39_0/d/3/{row}_{column}.jpg",
      "colCount": 1,
      "width": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "height": 512
     }
    ],
    "class": "ImageResource"
   },
   "class": "CubicPanoramaFrame",
   "left": {
    "levels": [
     {
      "url": "media/panorama_8D26FEDC_874A_2B92_41BD_9E25154EBA39_0/l/0/{row}_{column}.jpg",
      "colCount": 5,
      "width": 2560,
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "rowCount": 5,
      "height": 2560
     },
     {
      "url": "media/panorama_8D26FEDC_874A_2B92_41BD_9E25154EBA39_0/l/1/{row}_{column}.jpg",
      "colCount": 3,
      "width": 1536,
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "rowCount": 3,
      "height": 1536
     },
     {
      "url": "media/panorama_8D26FEDC_874A_2B92_41BD_9E25154EBA39_0/l/2/{row}_{column}.jpg",
      "colCount": 2,
      "width": 1024,
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_8D26FEDC_874A_2B92_41BD_9E25154EBA39_0/l/3/{row}_{column}.jpg",
      "colCount": 1,
      "width": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "height": 512
     }
    ],
    "class": "ImageResource"
   }
  }
 ],
 "label": "SAM_101_1970",
 "hfovMin": "135%",
 "id": "panorama_8D26FEDC_874A_2B92_41BD_9E25154EBA39",
 "overlays": [
  "this.panorama_8D26FEDC_874A_2B92_41BD_9E25154EBA39_tcap0",
  "this.overlay_8982942E_873A_7E8E_41D0_7F0625FD2EA0",
  "this.overlay_88450E43_873A_2AF6_41DD_58EA30552B4E",
  "this.overlay_88085E60_873A_2AB2_41D4_14E4FF7BFFD2"
 ],
 "partial": false,
 "adjacentPanoramas": [
  {
   "panorama": "this.panorama_8D3214D1_874A_3F92_41B8_DE3A41B87CDE",
   "class": "AdjacentPanorama"
  },
  {
   "panorama": "this.panorama_8D21215C_8746_3692_4179_F0E8FC89F914",
   "class": "AdjacentPanorama"
  },
  {
   "panorama": "this.panorama_8D23D510_8746_1E92_41AA_543AD4625D58",
   "class": "AdjacentPanorama"
  }
 ],
 "hfov": 360,
 "pitch": 0,
 "class": "Panorama",
 "vfov": 180,
 "thumbnailUrl": "media/panorama_8D26FEDC_874A_2B92_41BD_9E25154EBA39_t.jpg",
 "hfovMax": 130
},
{
 "initialPosition": {
  "yaw": -77.14,
  "class": "PanoramaCameraPosition",
  "pitch": -2.76
 },
 "initialSequence": {
  "class": "PanoramaCameraSequence",
  "movements": [
   {
    "yawSpeed": 7.96,
    "yawDelta": 18.5,
    "class": "DistancePanoramaCameraMovement",
    "easing": "cubic_in"
   },
   {
    "yawSpeed": 7.96,
    "yawDelta": 323,
    "class": "DistancePanoramaCameraMovement",
    "easing": "linear"
   },
   {
    "yawSpeed": 7.96,
    "yawDelta": 18.5,
    "class": "DistancePanoramaCameraMovement",
    "easing": "cubic_out"
   }
  ],
  "restartMovementOnUserInteraction": false
 },
 "id": "camera_85F694C0_8AC4_B648_419F_715322C5B34A",
 "class": "PanoramaCamera",
 "automaticZoomSpeed": 10
},
{
 "initialPosition": {
  "yaw": 0.92,
  "class": "PanoramaCameraPosition",
  "pitch": -3.67
 },
 "initialSequence": {
  "class": "PanoramaCameraSequence",
  "movements": [
   {
    "yawSpeed": 7.96,
    "yawDelta": 18.5,
    "class": "DistancePanoramaCameraMovement",
    "easing": "cubic_in"
   },
   {
    "yawSpeed": 7.96,
    "yawDelta": 323,
    "class": "DistancePanoramaCameraMovement",
    "easing": "linear"
   },
   {
    "yawSpeed": 7.96,
    "yawDelta": 18.5,
    "class": "DistancePanoramaCameraMovement",
    "easing": "cubic_out"
   }
  ],
  "restartMovementOnUserInteraction": false
 },
 "id": "camera_85C674E8_8AC4_B658_41C7_C41FA49C6C80",
 "class": "PanoramaCamera",
 "automaticZoomSpeed": 10
},
{
 "initialPosition": {
  "yaw": -93.67,
  "class": "PanoramaCameraPosition",
  "pitch": -4.59
 },
 "initialSequence": {
  "class": "PanoramaCameraSequence",
  "movements": [
   {
    "yawSpeed": 7.96,
    "yawDelta": 18.5,
    "class": "DistancePanoramaCameraMovement",
    "easing": "cubic_in"
   },
   {
    "yawSpeed": 7.96,
    "yawDelta": 323,
    "class": "DistancePanoramaCameraMovement",
    "easing": "linear"
   },
   {
    "yawSpeed": 7.96,
    "yawDelta": 18.5,
    "class": "DistancePanoramaCameraMovement",
    "easing": "cubic_out"
   }
  ],
  "restartMovementOnUserInteraction": false
 },
 "id": "camera_846A76C7_8AC4_B257_41D8_F6FFCFEB93FF",
 "class": "PanoramaCamera",
 "automaticZoomSpeed": 10
},
{
 "initialPosition": {
  "yaw": 71.63,
  "class": "PanoramaCameraPosition",
  "pitch": -7.35
 },
 "initialSequence": {
  "class": "PanoramaCameraSequence",
  "movements": [
   {
    "yawSpeed": 7.96,
    "yawDelta": 18.5,
    "class": "DistancePanoramaCameraMovement",
    "easing": "cubic_in"
   },
   {
    "yawSpeed": 7.96,
    "yawDelta": 323,
    "class": "DistancePanoramaCameraMovement",
    "easing": "linear"
   },
   {
    "yawSpeed": 7.96,
    "yawDelta": 18.5,
    "class": "DistancePanoramaCameraMovement",
    "easing": "cubic_out"
   }
  ],
  "restartMovementOnUserInteraction": false
 },
 "id": "camera_85406612_8AC4_B5C8_41C1_E7DEA36F7498",
 "class": "PanoramaCamera",
 "automaticZoomSpeed": 10
},
{
 "initialPosition": {
  "yaw": -103.78,
  "class": "PanoramaCameraPosition",
  "pitch": -2.76
 },
 "initialSequence": {
  "class": "PanoramaCameraSequence",
  "movements": [
   {
    "yawSpeed": 7.96,
    "yawDelta": 18.5,
    "class": "DistancePanoramaCameraMovement",
    "easing": "cubic_in"
   },
   {
    "yawSpeed": 7.96,
    "yawDelta": 323,
    "class": "DistancePanoramaCameraMovement",
    "easing": "linear"
   },
   {
    "yawSpeed": 7.96,
    "yawDelta": 18.5,
    "class": "DistancePanoramaCameraMovement",
    "easing": "cubic_out"
   }
  ],
  "restartMovementOnUserInteraction": false
 },
 "id": "camera_850D55A6_8AC4_B6C9_41D6_827629AC72DF",
 "class": "PanoramaCamera",
 "automaticZoomSpeed": 10
},
{
 "frames": [
  {
   "front": {
    "levels": [
     {
      "url": "media/panorama_8D1FC4A9_8746_1FB2_4199_50FEC28B1F42_0/f/0/{row}_{column}.jpg",
      "colCount": 5,
      "width": 2560,
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "rowCount": 5,
      "height": 2560
     },
     {
      "url": "media/panorama_8D1FC4A9_8746_1FB2_4199_50FEC28B1F42_0/f/1/{row}_{column}.jpg",
      "colCount": 3,
      "width": 1536,
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "rowCount": 3,
      "height": 1536
     },
     {
      "url": "media/panorama_8D1FC4A9_8746_1FB2_4199_50FEC28B1F42_0/f/2/{row}_{column}.jpg",
      "colCount": 2,
      "width": 1024,
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_8D1FC4A9_8746_1FB2_4199_50FEC28B1F42_0/f/3/{row}_{column}.jpg",
      "colCount": 1,
      "width": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "height": 512
     }
    ],
    "class": "ImageResource"
   },
   "top": {
    "levels": [
     {
      "url": "media/panorama_8D1FC4A9_8746_1FB2_4199_50FEC28B1F42_0/u/0/{row}_{column}.jpg",
      "colCount": 5,
      "width": 2560,
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "rowCount": 5,
      "height": 2560
     },
     {
      "url": "media/panorama_8D1FC4A9_8746_1FB2_4199_50FEC28B1F42_0/u/1/{row}_{column}.jpg",
      "colCount": 3,
      "width": 1536,
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "rowCount": 3,
      "height": 1536
     },
     {
      "url": "media/panorama_8D1FC4A9_8746_1FB2_4199_50FEC28B1F42_0/u/2/{row}_{column}.jpg",
      "colCount": 2,
      "width": 1024,
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_8D1FC4A9_8746_1FB2_4199_50FEC28B1F42_0/u/3/{row}_{column}.jpg",
      "colCount": 1,
      "width": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "height": 512
     }
    ],
    "class": "ImageResource"
   },
   "right": {
    "levels": [
     {
      "url": "media/panorama_8D1FC4A9_8746_1FB2_4199_50FEC28B1F42_0/r/0/{row}_{column}.jpg",
      "colCount": 5,
      "width": 2560,
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "rowCount": 5,
      "height": 2560
     },
     {
      "url": "media/panorama_8D1FC4A9_8746_1FB2_4199_50FEC28B1F42_0/r/1/{row}_{column}.jpg",
      "colCount": 3,
      "width": 1536,
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "rowCount": 3,
      "height": 1536
     },
     {
      "url": "media/panorama_8D1FC4A9_8746_1FB2_4199_50FEC28B1F42_0/r/2/{row}_{column}.jpg",
      "colCount": 2,
      "width": 1024,
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_8D1FC4A9_8746_1FB2_4199_50FEC28B1F42_0/r/3/{row}_{column}.jpg",
      "colCount": 1,
      "width": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "height": 512
     }
    ],
    "class": "ImageResource"
   },
   "back": {
    "levels": [
     {
      "url": "media/panorama_8D1FC4A9_8746_1FB2_4199_50FEC28B1F42_0/b/0/{row}_{column}.jpg",
      "colCount": 5,
      "width": 2560,
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "rowCount": 5,
      "height": 2560
     },
     {
      "url": "media/panorama_8D1FC4A9_8746_1FB2_4199_50FEC28B1F42_0/b/1/{row}_{column}.jpg",
      "colCount": 3,
      "width": 1536,
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "rowCount": 3,
      "height": 1536
     },
     {
      "url": "media/panorama_8D1FC4A9_8746_1FB2_4199_50FEC28B1F42_0/b/2/{row}_{column}.jpg",
      "colCount": 2,
      "width": 1024,
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_8D1FC4A9_8746_1FB2_4199_50FEC28B1F42_0/b/3/{row}_{column}.jpg",
      "colCount": 1,
      "width": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "height": 512
     }
    ],
    "class": "ImageResource"
   },
   "thumbnailUrl": "media/panorama_8D1FC4A9_8746_1FB2_4199_50FEC28B1F42_t.jpg",
   "bottom": {
    "levels": [
     {
      "url": "media/panorama_8D1FC4A9_8746_1FB2_4199_50FEC28B1F42_0/d/0/{row}_{column}.jpg",
      "colCount": 5,
      "width": 2560,
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "rowCount": 5,
      "height": 2560
     },
     {
      "url": "media/panorama_8D1FC4A9_8746_1FB2_4199_50FEC28B1F42_0/d/1/{row}_{column}.jpg",
      "colCount": 3,
      "width": 1536,
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "rowCount": 3,
      "height": 1536
     },
     {
      "url": "media/panorama_8D1FC4A9_8746_1FB2_4199_50FEC28B1F42_0/d/2/{row}_{column}.jpg",
      "colCount": 2,
      "width": 1024,
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_8D1FC4A9_8746_1FB2_4199_50FEC28B1F42_0/d/3/{row}_{column}.jpg",
      "colCount": 1,
      "width": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "height": 512
     }
    ],
    "class": "ImageResource"
   },
   "class": "CubicPanoramaFrame",
   "left": {
    "levels": [
     {
      "url": "media/panorama_8D1FC4A9_8746_1FB2_4199_50FEC28B1F42_0/l/0/{row}_{column}.jpg",
      "colCount": 5,
      "width": 2560,
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "rowCount": 5,
      "height": 2560
     },
     {
      "url": "media/panorama_8D1FC4A9_8746_1FB2_4199_50FEC28B1F42_0/l/1/{row}_{column}.jpg",
      "colCount": 3,
      "width": 1536,
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "rowCount": 3,
      "height": 1536
     },
     {
      "url": "media/panorama_8D1FC4A9_8746_1FB2_4199_50FEC28B1F42_0/l/2/{row}_{column}.jpg",
      "colCount": 2,
      "width": 1024,
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_8D1FC4A9_8746_1FB2_4199_50FEC28B1F42_0/l/3/{row}_{column}.jpg",
      "colCount": 1,
      "width": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "height": 512
     }
    ],
    "class": "ImageResource"
   }
  }
 ],
 "label": "SAM_101_1975",
 "hfovMin": "135%",
 "id": "panorama_8D1FC4A9_8746_1FB2_4199_50FEC28B1F42",
 "overlays": [
  "this.panorama_8D1FC4A9_8746_1FB2_4199_50FEC28B1F42_tcap0",
  "this.overlay_88850B15_87CA_2A92_41CB_EC1E5FF7A08D",
  "this.overlay_88BDDCA2_87CA_EFB7_4197_A38A448B5668"
 ],
 "partial": false,
 "adjacentPanoramas": [
  {
   "panorama": "this.panorama_8D3CFB4B_877A_6AF6_41CB_7F0920056CFD",
   "class": "AdjacentPanorama"
  },
  {
   "panorama": "this.panorama_8D012E2E_874A_2A8E_4191_30904C062B4B",
   "class": "AdjacentPanorama"
  }
 ],
 "hfov": 360,
 "pitch": 0,
 "class": "Panorama",
 "vfov": 180,
 "thumbnailUrl": "media/panorama_8D1FC4A9_8746_1FB2_4199_50FEC28B1F42_t.jpg",
 "hfovMax": 130
},
{
 "frames": [
  {
   "front": {
    "levels": [
     {
      "url": "media/panorama_8C698C0B_873E_2E76_41D9_D763A36BC981_0/f/0/{row}_{column}.jpg",
      "colCount": 5,
      "width": 2560,
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "rowCount": 5,
      "height": 2560
     },
     {
      "url": "media/panorama_8C698C0B_873E_2E76_41D9_D763A36BC981_0/f/1/{row}_{column}.jpg",
      "colCount": 3,
      "width": 1536,
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "rowCount": 3,
      "height": 1536
     },
     {
      "url": "media/panorama_8C698C0B_873E_2E76_41D9_D763A36BC981_0/f/2/{row}_{column}.jpg",
      "colCount": 2,
      "width": 1024,
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_8C698C0B_873E_2E76_41D9_D763A36BC981_0/f/3/{row}_{column}.jpg",
      "colCount": 1,
      "width": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "height": 512
     }
    ],
    "class": "ImageResource"
   },
   "top": {
    "levels": [
     {
      "url": "media/panorama_8C698C0B_873E_2E76_41D9_D763A36BC981_0/u/0/{row}_{column}.jpg",
      "colCount": 5,
      "width": 2560,
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "rowCount": 5,
      "height": 2560
     },
     {
      "url": "media/panorama_8C698C0B_873E_2E76_41D9_D763A36BC981_0/u/1/{row}_{column}.jpg",
      "colCount": 3,
      "width": 1536,
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "rowCount": 3,
      "height": 1536
     },
     {
      "url": "media/panorama_8C698C0B_873E_2E76_41D9_D763A36BC981_0/u/2/{row}_{column}.jpg",
      "colCount": 2,
      "width": 1024,
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_8C698C0B_873E_2E76_41D9_D763A36BC981_0/u/3/{row}_{column}.jpg",
      "colCount": 1,
      "width": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "height": 512
     }
    ],
    "class": "ImageResource"
   },
   "right": {
    "levels": [
     {
      "url": "media/panorama_8C698C0B_873E_2E76_41D9_D763A36BC981_0/r/0/{row}_{column}.jpg",
      "colCount": 5,
      "width": 2560,
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "rowCount": 5,
      "height": 2560
     },
     {
      "url": "media/panorama_8C698C0B_873E_2E76_41D9_D763A36BC981_0/r/1/{row}_{column}.jpg",
      "colCount": 3,
      "width": 1536,
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "rowCount": 3,
      "height": 1536
     },
     {
      "url": "media/panorama_8C698C0B_873E_2E76_41D9_D763A36BC981_0/r/2/{row}_{column}.jpg",
      "colCount": 2,
      "width": 1024,
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_8C698C0B_873E_2E76_41D9_D763A36BC981_0/r/3/{row}_{column}.jpg",
      "colCount": 1,
      "width": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "height": 512
     }
    ],
    "class": "ImageResource"
   },
   "back": {
    "levels": [
     {
      "url": "media/panorama_8C698C0B_873E_2E76_41D9_D763A36BC981_0/b/0/{row}_{column}.jpg",
      "colCount": 5,
      "width": 2560,
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "rowCount": 5,
      "height": 2560
     },
     {
      "url": "media/panorama_8C698C0B_873E_2E76_41D9_D763A36BC981_0/b/1/{row}_{column}.jpg",
      "colCount": 3,
      "width": 1536,
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "rowCount": 3,
      "height": 1536
     },
     {
      "url": "media/panorama_8C698C0B_873E_2E76_41D9_D763A36BC981_0/b/2/{row}_{column}.jpg",
      "colCount": 2,
      "width": 1024,
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_8C698C0B_873E_2E76_41D9_D763A36BC981_0/b/3/{row}_{column}.jpg",
      "colCount": 1,
      "width": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "height": 512
     }
    ],
    "class": "ImageResource"
   },
   "thumbnailUrl": "media/panorama_8C698C0B_873E_2E76_41D9_D763A36BC981_t.jpg",
   "bottom": {
    "levels": [
     {
      "url": "media/panorama_8C698C0B_873E_2E76_41D9_D763A36BC981_0/d/0/{row}_{column}.jpg",
      "colCount": 5,
      "width": 2560,
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "rowCount": 5,
      "height": 2560
     },
     {
      "url": "media/panorama_8C698C0B_873E_2E76_41D9_D763A36BC981_0/d/1/{row}_{column}.jpg",
      "colCount": 3,
      "width": 1536,
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "rowCount": 3,
      "height": 1536
     },
     {
      "url": "media/panorama_8C698C0B_873E_2E76_41D9_D763A36BC981_0/d/2/{row}_{column}.jpg",
      "colCount": 2,
      "width": 1024,
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_8C698C0B_873E_2E76_41D9_D763A36BC981_0/d/3/{row}_{column}.jpg",
      "colCount": 1,
      "width": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "height": 512
     }
    ],
    "class": "ImageResource"
   },
   "class": "CubicPanoramaFrame",
   "left": {
    "levels": [
     {
      "url": "media/panorama_8C698C0B_873E_2E76_41D9_D763A36BC981_0/l/0/{row}_{column}.jpg",
      "colCount": 5,
      "width": 2560,
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "rowCount": 5,
      "height": 2560
     },
     {
      "url": "media/panorama_8C698C0B_873E_2E76_41D9_D763A36BC981_0/l/1/{row}_{column}.jpg",
      "colCount": 3,
      "width": 1536,
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "rowCount": 3,
      "height": 1536
     },
     {
      "url": "media/panorama_8C698C0B_873E_2E76_41D9_D763A36BC981_0/l/2/{row}_{column}.jpg",
      "colCount": 2,
      "width": 1024,
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_8C698C0B_873E_2E76_41D9_D763A36BC981_0/l/3/{row}_{column}.jpg",
      "colCount": 1,
      "width": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "height": 512
     }
    ],
    "class": "ImageResource"
   }
  }
 ],
 "label": "SAM_101_1940",
 "hfovMin": "135%",
 "id": "panorama_8C698C0B_873E_2E76_41D9_D763A36BC981",
 "overlays": [
  "this.panorama_8C698C0B_873E_2E76_41D9_D763A36BC981_tcap0",
  "this.overlay_887C3082_873E_F677_41C5_D151B2BCA94A"
 ],
 "partial": false,
 "adjacentPanoramas": [
  {
   "panorama": "this.panorama_8D23D510_8746_1E92_41AA_543AD4625D58",
   "class": "AdjacentPanorama"
  }
 ],
 "hfov": 360,
 "pitch": 0,
 "class": "Panorama",
 "vfov": 180,
 "thumbnailUrl": "media/panorama_8C698C0B_873E_2E76_41D9_D763A36BC981_t.jpg",
 "hfovMax": 130
},
{
 "initialPosition": {
  "yaw": 0,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 },
 "initialSequence": {
  "class": "PanoramaCameraSequence",
  "movements": [
   {
    "yawSpeed": 7.96,
    "yawDelta": 18.5,
    "class": "DistancePanoramaCameraMovement",
    "easing": "cubic_in"
   },
   {
    "yawSpeed": 7.96,
    "yawDelta": 323,
    "class": "DistancePanoramaCameraMovement",
    "easing": "linear"
   },
   {
    "yawSpeed": 7.96,
    "yawDelta": 18.5,
    "class": "DistancePanoramaCameraMovement",
    "easing": "cubic_out"
   }
  ],
  "restartMovementOnUserInteraction": false
 },
 "id": "panorama_8D3CFB4B_877A_6AF6_41CB_7F0920056CFD_camera",
 "class": "PanoramaCamera",
 "automaticZoomSpeed": 10
},
{
 "items": [
  {
   "media": "this.panorama_8C698C0B_873E_2E76_41D9_D763A36BC981",
   "begin": "this.setEndToItemIndex(this.mainPlayList, 0, 1)",
   "player": "this.MainViewerPanoramaPlayer",
   "class": "PanoramaPlayListItem",
   "camera": "this.panorama_8C698C0B_873E_2E76_41D9_D763A36BC981_camera"
  },
  {
   "media": "this.panorama_8D23D510_8746_1E92_41AA_543AD4625D58",
   "begin": "this.setEndToItemIndex(this.mainPlayList, 1, 2)",
   "player": "this.MainViewerPanoramaPlayer",
   "class": "PanoramaPlayListItem",
   "camera": "this.panorama_8D23D510_8746_1E92_41AA_543AD4625D58_camera"
  },
  {
   "media": "this.panorama_8D26F0D5_874A_1792_41C4_D544048ED703",
   "begin": "this.setEndToItemIndex(this.mainPlayList, 2, 3)",
   "player": "this.MainViewerPanoramaPlayer",
   "class": "PanoramaPlayListItem",
   "camera": "this.panorama_8D26F0D5_874A_1792_41C4_D544048ED703_camera"
  },
  {
   "media": "this.panorama_8D330B1E_874E_6A8E_41D2_0A89F6F28F55",
   "begin": "this.setEndToItemIndex(this.mainPlayList, 3, 4)",
   "player": "this.MainViewerPanoramaPlayer",
   "class": "PanoramaPlayListItem",
   "camera": "this.panorama_8D330B1E_874E_6A8E_41D2_0A89F6F28F55_camera"
  },
  {
   "media": "this.panorama_8D265541_874A_FEF2_41DE_A0BC495C5419",
   "begin": "this.setEndToItemIndex(this.mainPlayList, 4, 5)",
   "player": "this.MainViewerPanoramaPlayer",
   "class": "PanoramaPlayListItem",
   "camera": "this.panorama_8D265541_874A_FEF2_41DE_A0BC495C5419_camera"
  },
  {
   "media": "this.panorama_8D349E28_875A_2AB3_4191_8B7C205E4B8B",
   "begin": "this.setEndToItemIndex(this.mainPlayList, 5, 6)",
   "player": "this.MainViewerPanoramaPlayer",
   "class": "PanoramaPlayListItem",
   "camera": "this.panorama_8D349E28_875A_2AB3_4191_8B7C205E4B8B_camera"
  },
  {
   "media": "this.panorama_8D2AB845_875A_36FD_41C5_7712FAF92241",
   "begin": "this.setEndToItemIndex(this.mainPlayList, 6, 7)",
   "player": "this.MainViewerPanoramaPlayer",
   "class": "PanoramaPlayListItem",
   "camera": "this.panorama_8D2AB845_875A_36FD_41C5_7712FAF92241_camera"
  },
  {
   "media": "this.panorama_8D342236_875E_1A9E_41D1_D2B4A3232FA4",
   "begin": "this.setEndToItemIndex(this.mainPlayList, 7, 8)",
   "player": "this.MainViewerPanoramaPlayer",
   "class": "PanoramaPlayListItem",
   "camera": "this.panorama_8D342236_875E_1A9E_41D1_D2B4A3232FA4_camera"
  },
  {
   "media": "this.panorama_8D2E44C5_875A_FFF2_41D2_998B2388C555",
   "begin": "this.setEndToItemIndex(this.mainPlayList, 8, 9)",
   "player": "this.MainViewerPanoramaPlayer",
   "class": "PanoramaPlayListItem",
   "camera": "this.panorama_8D2E44C5_875A_FFF2_41D2_998B2388C555_camera"
  },
  {
   "media": "this.panorama_8D3214D1_874A_3F92_41B8_DE3A41B87CDE",
   "begin": "this.setEndToItemIndex(this.mainPlayList, 9, 10)",
   "player": "this.MainViewerPanoramaPlayer",
   "class": "PanoramaPlayListItem",
   "camera": "this.panorama_8D3214D1_874A_3F92_41B8_DE3A41B87CDE_camera"
  },
  {
   "media": "this.panorama_8D26FEDC_874A_2B92_41BD_9E25154EBA39",
   "begin": "this.setEndToItemIndex(this.mainPlayList, 10, 11)",
   "player": "this.MainViewerPanoramaPlayer",
   "class": "PanoramaPlayListItem",
   "camera": "this.panorama_8D26FEDC_874A_2B92_41BD_9E25154EBA39_camera"
  },
  {
   "media": "this.panorama_8D21215C_8746_3692_4179_F0E8FC89F914",
   "begin": "this.setEndToItemIndex(this.mainPlayList, 11, 12)",
   "player": "this.MainViewerPanoramaPlayer",
   "class": "PanoramaPlayListItem",
   "camera": "this.panorama_8D21215C_8746_3692_4179_F0E8FC89F914_camera"
  },
  {
   "media": "this.panorama_8D3FB7D2_877A_1996_41D4_7689BB9D7D11",
   "begin": "this.setEndToItemIndex(this.mainPlayList, 12, 13)",
   "player": "this.MainViewerPanoramaPlayer",
   "class": "PanoramaPlayListItem",
   "camera": "this.panorama_8D3FB7D2_877A_1996_41D4_7689BB9D7D11_camera"
  },
  {
   "media": "this.panorama_8D277116_877E_F69E_41DF_02AF33F8B702",
   "begin": "this.setEndToItemIndex(this.mainPlayList, 13, 14)",
   "player": "this.MainViewerPanoramaPlayer",
   "class": "PanoramaPlayListItem",
   "camera": "this.panorama_8D277116_877E_F69E_41DF_02AF33F8B702_camera"
  },
  {
   "media": "this.panorama_8D3CFB4B_877A_6AF6_41CB_7F0920056CFD",
   "begin": "this.setEndToItemIndex(this.mainPlayList, 14, 15)",
   "player": "this.MainViewerPanoramaPlayer",
   "class": "PanoramaPlayListItem",
   "camera": "this.panorama_8D3CFB4B_877A_6AF6_41CB_7F0920056CFD_camera"
  },
  {
   "media": "this.panorama_8D1FC4A9_8746_1FB2_4199_50FEC28B1F42",
   "begin": "this.setEndToItemIndex(this.mainPlayList, 15, 16)",
   "player": "this.MainViewerPanoramaPlayer",
   "class": "PanoramaPlayListItem",
   "camera": "this.panorama_8D1FC4A9_8746_1FB2_4199_50FEC28B1F42_camera"
  },
  {
   "media": "this.panorama_8D012E2E_874A_2A8E_4191_30904C062B4B",
   "end": "this.trigger('tourEnded')",
   "begin": "this.setEndToItemIndex(this.mainPlayList, 16, 0)",
   "player": "this.MainViewerPanoramaPlayer",
   "class": "PanoramaPlayListItem",
   "camera": "this.panorama_8D012E2E_874A_2A8E_4191_30904C062B4B_camera"
  }
 ],
 "id": "mainPlayList",
 "class": "PlayList"
},
{
 "initialPosition": {
  "yaw": 88.16,
  "class": "PanoramaCameraPosition",
  "pitch": -12.86
 },
 "initialSequence": {
  "class": "PanoramaCameraSequence",
  "movements": [
   {
    "yawSpeed": 7.96,
    "yawDelta": 18.5,
    "class": "DistancePanoramaCameraMovement",
    "easing": "cubic_in"
   },
   {
    "yawSpeed": 7.96,
    "yawDelta": 323,
    "class": "DistancePanoramaCameraMovement",
    "easing": "linear"
   },
   {
    "yawSpeed": 7.96,
    "yawDelta": 18.5,
    "class": "DistancePanoramaCameraMovement",
    "easing": "cubic_out"
   }
  ],
  "restartMovementOnUserInteraction": false
 },
 "id": "camera_847E26EE_8AC4_B258_41CC_352D8BFFE83C",
 "class": "PanoramaCamera",
 "automaticZoomSpeed": 10
},
{
 "initialPosition": {
  "yaw": -90,
  "class": "PanoramaCameraPosition",
  "pitch": -5.51
 },
 "initialSequence": {
  "class": "PanoramaCameraSequence",
  "movements": [
   {
    "yawSpeed": 7.96,
    "yawDelta": 18.5,
    "class": "DistancePanoramaCameraMovement",
    "easing": "cubic_in"
   },
   {
    "yawSpeed": 7.96,
    "yawDelta": 323,
    "class": "DistancePanoramaCameraMovement",
    "easing": "linear"
   },
   {
    "yawSpeed": 7.96,
    "yawDelta": 18.5,
    "class": "DistancePanoramaCameraMovement",
    "easing": "cubic_out"
   }
  ],
  "restartMovementOnUserInteraction": false
 },
 "id": "camera_85BA9478_8AC4_B638_41CA_3F545798AAA6",
 "class": "PanoramaCamera",
 "automaticZoomSpeed": 10
},
{
 "initialPosition": {
  "yaw": 85.41,
  "class": "PanoramaCameraPosition",
  "pitch": -0.92
 },
 "initialSequence": {
  "class": "PanoramaCameraSequence",
  "movements": [
   {
    "yawSpeed": 7.96,
    "yawDelta": 18.5,
    "class": "DistancePanoramaCameraMovement",
    "easing": "cubic_in"
   },
   {
    "yawSpeed": 7.96,
    "yawDelta": 323,
    "class": "DistancePanoramaCameraMovement",
    "easing": "linear"
   },
   {
    "yawSpeed": 7.96,
    "yawDelta": 18.5,
    "class": "DistancePanoramaCameraMovement",
    "easing": "cubic_out"
   }
  ],
  "restartMovementOnUserInteraction": false
 },
 "id": "camera_9AA2563A_8AC4_B238_41D2_2DC57C9425BC",
 "class": "PanoramaCamera",
 "automaticZoomSpeed": 10
},
{
 "initialPosition": {
  "yaw": 0,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 },
 "initialSequence": {
  "class": "PanoramaCameraSequence",
  "movements": [
   {
    "yawSpeed": 7.96,
    "yawDelta": 18.5,
    "class": "DistancePanoramaCameraMovement",
    "easing": "cubic_in"
   },
   {
    "yawSpeed": 7.96,
    "yawDelta": 323,
    "class": "DistancePanoramaCameraMovement",
    "easing": "linear"
   },
   {
    "yawSpeed": 7.96,
    "yawDelta": 18.5,
    "class": "DistancePanoramaCameraMovement",
    "easing": "cubic_out"
   }
  ],
  "restartMovementOnUserInteraction": false
 },
 "id": "panorama_8D2E44C5_875A_FFF2_41D2_998B2388C555_camera",
 "class": "PanoramaCamera",
 "automaticZoomSpeed": 10
},
{
 "initialPosition": {
  "yaw": 0,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 },
 "initialSequence": {
  "class": "PanoramaCameraSequence",
  "movements": [
   {
    "yawSpeed": 7.96,
    "yawDelta": 18.5,
    "class": "DistancePanoramaCameraMovement",
    "easing": "cubic_in"
   },
   {
    "yawSpeed": 7.96,
    "yawDelta": 323,
    "class": "DistancePanoramaCameraMovement",
    "easing": "linear"
   },
   {
    "yawSpeed": 7.96,
    "yawDelta": 18.5,
    "class": "DistancePanoramaCameraMovement",
    "easing": "cubic_out"
   }
  ],
  "restartMovementOnUserInteraction": false
 },
 "id": "panorama_8D349E28_875A_2AB3_4191_8B7C205E4B8B_camera",
 "class": "PanoramaCamera",
 "automaticZoomSpeed": 10
},
{
 "initialPosition": {
  "yaw": 0,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 },
 "initialSequence": {
  "class": "PanoramaCameraSequence",
  "movements": [
   {
    "yawSpeed": 7.96,
    "yawDelta": 18.5,
    "class": "DistancePanoramaCameraMovement",
    "easing": "cubic_in"
   },
   {
    "yawSpeed": 7.96,
    "yawDelta": 323,
    "class": "DistancePanoramaCameraMovement",
    "easing": "linear"
   },
   {
    "yawSpeed": 7.96,
    "yawDelta": 18.5,
    "class": "DistancePanoramaCameraMovement",
    "easing": "cubic_out"
   }
  ],
  "restartMovementOnUserInteraction": false
 },
 "id": "panorama_8D23D510_8746_1E92_41AA_543AD4625D58_camera",
 "class": "PanoramaCamera",
 "automaticZoomSpeed": 10
},
{
 "frames": [
  {
   "front": {
    "levels": [
     {
      "url": "media/panorama_8D349E28_875A_2AB3_4191_8B7C205E4B8B_0/f/0/{row}_{column}.jpg",
      "colCount": 5,
      "width": 2560,
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "rowCount": 5,
      "height": 2560
     },
     {
      "url": "media/panorama_8D349E28_875A_2AB3_4191_8B7C205E4B8B_0/f/1/{row}_{column}.jpg",
      "colCount": 3,
      "width": 1536,
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "rowCount": 3,
      "height": 1536
     },
     {
      "url": "media/panorama_8D349E28_875A_2AB3_4191_8B7C205E4B8B_0/f/2/{row}_{column}.jpg",
      "colCount": 2,
      "width": 1024,
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_8D349E28_875A_2AB3_4191_8B7C205E4B8B_0/f/3/{row}_{column}.jpg",
      "colCount": 1,
      "width": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "height": 512
     }
    ],
    "class": "ImageResource"
   },
   "top": {
    "levels": [
     {
      "url": "media/panorama_8D349E28_875A_2AB3_4191_8B7C205E4B8B_0/u/0/{row}_{column}.jpg",
      "colCount": 5,
      "width": 2560,
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "rowCount": 5,
      "height": 2560
     },
     {
      "url": "media/panorama_8D349E28_875A_2AB3_4191_8B7C205E4B8B_0/u/1/{row}_{column}.jpg",
      "colCount": 3,
      "width": 1536,
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "rowCount": 3,
      "height": 1536
     },
     {
      "url": "media/panorama_8D349E28_875A_2AB3_4191_8B7C205E4B8B_0/u/2/{row}_{column}.jpg",
      "colCount": 2,
      "width": 1024,
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_8D349E28_875A_2AB3_4191_8B7C205E4B8B_0/u/3/{row}_{column}.jpg",
      "colCount": 1,
      "width": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "height": 512
     }
    ],
    "class": "ImageResource"
   },
   "right": {
    "levels": [
     {
      "url": "media/panorama_8D349E28_875A_2AB3_4191_8B7C205E4B8B_0/r/0/{row}_{column}.jpg",
      "colCount": 5,
      "width": 2560,
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "rowCount": 5,
      "height": 2560
     },
     {
      "url": "media/panorama_8D349E28_875A_2AB3_4191_8B7C205E4B8B_0/r/1/{row}_{column}.jpg",
      "colCount": 3,
      "width": 1536,
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "rowCount": 3,
      "height": 1536
     },
     {
      "url": "media/panorama_8D349E28_875A_2AB3_4191_8B7C205E4B8B_0/r/2/{row}_{column}.jpg",
      "colCount": 2,
      "width": 1024,
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_8D349E28_875A_2AB3_4191_8B7C205E4B8B_0/r/3/{row}_{column}.jpg",
      "colCount": 1,
      "width": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "height": 512
     }
    ],
    "class": "ImageResource"
   },
   "back": {
    "levels": [
     {
      "url": "media/panorama_8D349E28_875A_2AB3_4191_8B7C205E4B8B_0/b/0/{row}_{column}.jpg",
      "colCount": 5,
      "width": 2560,
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "rowCount": 5,
      "height": 2560
     },
     {
      "url": "media/panorama_8D349E28_875A_2AB3_4191_8B7C205E4B8B_0/b/1/{row}_{column}.jpg",
      "colCount": 3,
      "width": 1536,
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "rowCount": 3,
      "height": 1536
     },
     {
      "url": "media/panorama_8D349E28_875A_2AB3_4191_8B7C205E4B8B_0/b/2/{row}_{column}.jpg",
      "colCount": 2,
      "width": 1024,
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_8D349E28_875A_2AB3_4191_8B7C205E4B8B_0/b/3/{row}_{column}.jpg",
      "colCount": 1,
      "width": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "height": 512
     }
    ],
    "class": "ImageResource"
   },
   "thumbnailUrl": "media/panorama_8D349E28_875A_2AB3_4191_8B7C205E4B8B_t.jpg",
   "bottom": {
    "levels": [
     {
      "url": "media/panorama_8D349E28_875A_2AB3_4191_8B7C205E4B8B_0/d/0/{row}_{column}.jpg",
      "colCount": 5,
      "width": 2560,
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "rowCount": 5,
      "height": 2560
     },
     {
      "url": "media/panorama_8D349E28_875A_2AB3_4191_8B7C205E4B8B_0/d/1/{row}_{column}.jpg",
      "colCount": 3,
      "width": 1536,
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "rowCount": 3,
      "height": 1536
     },
     {
      "url": "media/panorama_8D349E28_875A_2AB3_4191_8B7C205E4B8B_0/d/2/{row}_{column}.jpg",
      "colCount": 2,
      "width": 1024,
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_8D349E28_875A_2AB3_4191_8B7C205E4B8B_0/d/3/{row}_{column}.jpg",
      "colCount": 1,
      "width": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "height": 512
     }
    ],
    "class": "ImageResource"
   },
   "class": "CubicPanoramaFrame",
   "left": {
    "levels": [
     {
      "url": "media/panorama_8D349E28_875A_2AB3_4191_8B7C205E4B8B_0/l/0/{row}_{column}.jpg",
      "colCount": 5,
      "width": 2560,
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "rowCount": 5,
      "height": 2560
     },
     {
      "url": "media/panorama_8D349E28_875A_2AB3_4191_8B7C205E4B8B_0/l/1/{row}_{column}.jpg",
      "colCount": 3,
      "width": 1536,
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "rowCount": 3,
      "height": 1536
     },
     {
      "url": "media/panorama_8D349E28_875A_2AB3_4191_8B7C205E4B8B_0/l/2/{row}_{column}.jpg",
      "colCount": 2,
      "width": 1024,
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_8D349E28_875A_2AB3_4191_8B7C205E4B8B_0/l/3/{row}_{column}.jpg",
      "colCount": 1,
      "width": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "height": 512
     }
    ],
    "class": "ImageResource"
   }
  }
 ],
 "label": "SAM_101_1965",
 "hfovMin": "135%",
 "id": "panorama_8D349E28_875A_2AB3_4191_8B7C205E4B8B",
 "overlays": [
  "this.panorama_8D349E28_875A_2AB3_4191_8B7C205E4B8B_tcap0",
  "this.overlay_898AB4C3_873E_7FF6_41A1_1875BC19E479",
  "this.overlay_884B692B_873E_16B6_41DE_FE551AFAAFB5",
  "this.overlay_88F717A4_873E_19B2_41CD_19077D661A00"
 ],
 "partial": false,
 "adjacentPanoramas": [
  {
   "panorama": "this.panorama_8D2AB845_875A_36FD_41C5_7712FAF92241",
   "class": "AdjacentPanorama"
  },
  {
   "panorama": "this.panorama_8D342236_875E_1A9E_41D1_D2B4A3232FA4",
   "class": "AdjacentPanorama"
  },
  {
   "panorama": "this.panorama_8D265541_874A_FEF2_41DE_A0BC495C5419",
   "class": "AdjacentPanorama"
  }
 ],
 "hfov": 360,
 "pitch": 0,
 "class": "Panorama",
 "vfov": 180,
 "thumbnailUrl": "media/panorama_8D349E28_875A_2AB3_4191_8B7C205E4B8B_t.jpg",
 "hfovMax": 130
},
{
 "frames": [
  {
   "front": {
    "levels": [
     {
      "url": "media/panorama_8D21215C_8746_3692_4179_F0E8FC89F914_0/f/0/{row}_{column}.jpg",
      "colCount": 5,
      "width": 2560,
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "rowCount": 5,
      "height": 2560
     },
     {
      "url": "media/panorama_8D21215C_8746_3692_4179_F0E8FC89F914_0/f/1/{row}_{column}.jpg",
      "colCount": 3,
      "width": 1536,
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "rowCount": 3,
      "height": 1536
     },
     {
      "url": "media/panorama_8D21215C_8746_3692_4179_F0E8FC89F914_0/f/2/{row}_{column}.jpg",
      "colCount": 2,
      "width": 1024,
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_8D21215C_8746_3692_4179_F0E8FC89F914_0/f/3/{row}_{column}.jpg",
      "colCount": 1,
      "width": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "height": 512
     }
    ],
    "class": "ImageResource"
   },
   "top": {
    "levels": [
     {
      "url": "media/panorama_8D21215C_8746_3692_4179_F0E8FC89F914_0/u/0/{row}_{column}.jpg",
      "colCount": 5,
      "width": 2560,
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "rowCount": 5,
      "height": 2560
     },
     {
      "url": "media/panorama_8D21215C_8746_3692_4179_F0E8FC89F914_0/u/1/{row}_{column}.jpg",
      "colCount": 3,
      "width": 1536,
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "rowCount": 3,
      "height": 1536
     },
     {
      "url": "media/panorama_8D21215C_8746_3692_4179_F0E8FC89F914_0/u/2/{row}_{column}.jpg",
      "colCount": 2,
      "width": 1024,
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_8D21215C_8746_3692_4179_F0E8FC89F914_0/u/3/{row}_{column}.jpg",
      "colCount": 1,
      "width": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "height": 512
     }
    ],
    "class": "ImageResource"
   },
   "right": {
    "levels": [
     {
      "url": "media/panorama_8D21215C_8746_3692_4179_F0E8FC89F914_0/r/0/{row}_{column}.jpg",
      "colCount": 5,
      "width": 2560,
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "rowCount": 5,
      "height": 2560
     },
     {
      "url": "media/panorama_8D21215C_8746_3692_4179_F0E8FC89F914_0/r/1/{row}_{column}.jpg",
      "colCount": 3,
      "width": 1536,
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "rowCount": 3,
      "height": 1536
     },
     {
      "url": "media/panorama_8D21215C_8746_3692_4179_F0E8FC89F914_0/r/2/{row}_{column}.jpg",
      "colCount": 2,
      "width": 1024,
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_8D21215C_8746_3692_4179_F0E8FC89F914_0/r/3/{row}_{column}.jpg",
      "colCount": 1,
      "width": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "height": 512
     }
    ],
    "class": "ImageResource"
   },
   "back": {
    "levels": [
     {
      "url": "media/panorama_8D21215C_8746_3692_4179_F0E8FC89F914_0/b/0/{row}_{column}.jpg",
      "colCount": 5,
      "width": 2560,
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "rowCount": 5,
      "height": 2560
     },
     {
      "url": "media/panorama_8D21215C_8746_3692_4179_F0E8FC89F914_0/b/1/{row}_{column}.jpg",
      "colCount": 3,
      "width": 1536,
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "rowCount": 3,
      "height": 1536
     },
     {
      "url": "media/panorama_8D21215C_8746_3692_4179_F0E8FC89F914_0/b/2/{row}_{column}.jpg",
      "colCount": 2,
      "width": 1024,
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_8D21215C_8746_3692_4179_F0E8FC89F914_0/b/3/{row}_{column}.jpg",
      "colCount": 1,
      "width": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "height": 512
     }
    ],
    "class": "ImageResource"
   },
   "thumbnailUrl": "media/panorama_8D21215C_8746_3692_4179_F0E8FC89F914_t.jpg",
   "bottom": {
    "levels": [
     {
      "url": "media/panorama_8D21215C_8746_3692_4179_F0E8FC89F914_0/d/0/{row}_{column}.jpg",
      "colCount": 5,
      "width": 2560,
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "rowCount": 5,
      "height": 2560
     },
     {
      "url": "media/panorama_8D21215C_8746_3692_4179_F0E8FC89F914_0/d/1/{row}_{column}.jpg",
      "colCount": 3,
      "width": 1536,
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "rowCount": 3,
      "height": 1536
     },
     {
      "url": "media/panorama_8D21215C_8746_3692_4179_F0E8FC89F914_0/d/2/{row}_{column}.jpg",
      "colCount": 2,
      "width": 1024,
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_8D21215C_8746_3692_4179_F0E8FC89F914_0/d/3/{row}_{column}.jpg",
      "colCount": 1,
      "width": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "height": 512
     }
    ],
    "class": "ImageResource"
   },
   "class": "CubicPanoramaFrame",
   "left": {
    "levels": [
     {
      "url": "media/panorama_8D21215C_8746_3692_4179_F0E8FC89F914_0/l/0/{row}_{column}.jpg",
      "colCount": 5,
      "width": 2560,
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "rowCount": 5,
      "height": 2560
     },
     {
      "url": "media/panorama_8D21215C_8746_3692_4179_F0E8FC89F914_0/l/1/{row}_{column}.jpg",
      "colCount": 3,
      "width": 1536,
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "rowCount": 3,
      "height": 1536
     },
     {
      "url": "media/panorama_8D21215C_8746_3692_4179_F0E8FC89F914_0/l/2/{row}_{column}.jpg",
      "colCount": 2,
      "width": 1024,
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_8D21215C_8746_3692_4179_F0E8FC89F914_0/l/3/{row}_{column}.jpg",
      "colCount": 1,
      "width": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "height": 512
     }
    ],
    "class": "ImageResource"
   }
  }
 ],
 "label": "SAM_101_1971",
 "hfovMin": "135%",
 "id": "panorama_8D21215C_8746_3692_4179_F0E8FC89F914",
 "overlays": [
  "this.panorama_8D21215C_8746_3692_4179_F0E8FC89F914_tcap0",
  "this.overlay_8980E716_873A_1A9E_41D1_DF0FDB83C9C5"
 ],
 "partial": false,
 "adjacentPanoramas": [
  {
   "panorama": "this.panorama_8D26FEDC_874A_2B92_41BD_9E25154EBA39",
   "class": "AdjacentPanorama"
  }
 ],
 "hfov": 360,
 "pitch": 0,
 "class": "Panorama",
 "vfov": 180,
 "thumbnailUrl": "media/panorama_8D21215C_8746_3692_4179_F0E8FC89F914_t.jpg",
 "hfovMax": 130
},
{
 "initialPosition": {
  "yaw": 82.65,
  "class": "PanoramaCameraPosition",
  "pitch": -9.18
 },
 "initialSequence": {
  "class": "PanoramaCameraSequence",
  "movements": [
   {
    "yawSpeed": 7.96,
    "yawDelta": 18.5,
    "class": "DistancePanoramaCameraMovement",
    "easing": "cubic_in"
   },
   {
    "yawSpeed": 7.96,
    "yawDelta": 323,
    "class": "DistancePanoramaCameraMovement",
    "easing": "linear"
   },
   {
    "yawSpeed": 7.96,
    "yawDelta": 18.5,
    "class": "DistancePanoramaCameraMovement",
    "easing": "cubic_out"
   }
  ],
  "restartMovementOnUserInteraction": false
 },
 "id": "camera_85D77510_8AC4_B7C9_41C7_84DE2F7A28B5",
 "class": "PanoramaCamera",
 "automaticZoomSpeed": 10
},
{
 "initialPosition": {
  "yaw": 89.08,
  "class": "PanoramaCameraPosition",
  "pitch": -6.43
 },
 "initialSequence": {
  "class": "PanoramaCameraSequence",
  "movements": [
   {
    "yawSpeed": 7.96,
    "yawDelta": 18.5,
    "class": "DistancePanoramaCameraMovement",
    "easing": "cubic_in"
   },
   {
    "yawSpeed": 7.96,
    "yawDelta": 323,
    "class": "DistancePanoramaCameraMovement",
    "easing": "linear"
   },
   {
    "yawSpeed": 7.96,
    "yawDelta": 18.5,
    "class": "DistancePanoramaCameraMovement",
    "easing": "cubic_out"
   }
  ],
  "restartMovementOnUserInteraction": false
 },
 "id": "camera_8442171B_8AC4_B3F8_41D0_94A4C83FEA10",
 "class": "PanoramaCamera",
 "automaticZoomSpeed": 10
},
{
 "initialPosition": {
  "yaw": 91.84,
  "class": "PanoramaCameraPosition",
  "pitch": -3.67
 },
 "initialSequence": {
  "class": "PanoramaCameraSequence",
  "movements": [
   {
    "yawSpeed": 7.96,
    "yawDelta": 18.5,
    "class": "DistancePanoramaCameraMovement",
    "easing": "cubic_in"
   },
   {
    "yawSpeed": 7.96,
    "yawDelta": 323,
    "class": "DistancePanoramaCameraMovement",
    "easing": "linear"
   },
   {
    "yawSpeed": 7.96,
    "yawDelta": 18.5,
    "class": "DistancePanoramaCameraMovement",
    "easing": "cubic_out"
   }
  ],
  "restartMovementOnUserInteraction": false
 },
 "id": "camera_85D87536_8AC4_B7C9_41D9_4C40C39C13C6",
 "class": "PanoramaCamera",
 "automaticZoomSpeed": 10
},
{
 "initialPosition": {
  "yaw": 0,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 },
 "initialSequence": {
  "class": "PanoramaCameraSequence",
  "movements": [
   {
    "yawSpeed": 7.96,
    "yawDelta": 18.5,
    "class": "DistancePanoramaCameraMovement",
    "easing": "cubic_in"
   },
   {
    "yawSpeed": 7.96,
    "yawDelta": 323,
    "class": "DistancePanoramaCameraMovement",
    "easing": "linear"
   },
   {
    "yawSpeed": 7.96,
    "yawDelta": 18.5,
    "class": "DistancePanoramaCameraMovement",
    "easing": "cubic_out"
   }
  ],
  "restartMovementOnUserInteraction": false
 },
 "id": "panorama_8D330B1E_874E_6A8E_41D2_0A89F6F28F55_camera",
 "class": "PanoramaCamera",
 "automaticZoomSpeed": 10
},
{
 "initialPosition": {
  "yaw": -106.53,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 },
 "initialSequence": {
  "class": "PanoramaCameraSequence",
  "movements": [
   {
    "yawSpeed": 7.96,
    "yawDelta": 18.5,
    "class": "DistancePanoramaCameraMovement",
    "easing": "cubic_in"
   },
   {
    "yawSpeed": 7.96,
    "yawDelta": 323,
    "class": "DistancePanoramaCameraMovement",
    "easing": "linear"
   },
   {
    "yawSpeed": 7.96,
    "yawDelta": 18.5,
    "class": "DistancePanoramaCameraMovement",
    "easing": "cubic_out"
   }
  ],
  "restartMovementOnUserInteraction": false
 },
 "id": "camera_85525626_8AC4_B5C8_41D6_8780B5FC2491",
 "class": "PanoramaCamera",
 "automaticZoomSpeed": 10
},
{
 "frames": [
  {
   "front": {
    "levels": [
     {
      "url": "media/panorama_8D3FB7D2_877A_1996_41D4_7689BB9D7D11_0/f/0/{row}_{column}.jpg",
      "colCount": 5,
      "width": 2560,
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "rowCount": 5,
      "height": 2560
     },
     {
      "url": "media/panorama_8D3FB7D2_877A_1996_41D4_7689BB9D7D11_0/f/1/{row}_{column}.jpg",
      "colCount": 3,
      "width": 1536,
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "rowCount": 3,
      "height": 1536
     },
     {
      "url": "media/panorama_8D3FB7D2_877A_1996_41D4_7689BB9D7D11_0/f/2/{row}_{column}.jpg",
      "colCount": 2,
      "width": 1024,
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_8D3FB7D2_877A_1996_41D4_7689BB9D7D11_0/f/3/{row}_{column}.jpg",
      "colCount": 1,
      "width": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "height": 512
     }
    ],
    "class": "ImageResource"
   },
   "top": {
    "levels": [
     {
      "url": "media/panorama_8D3FB7D2_877A_1996_41D4_7689BB9D7D11_0/u/0/{row}_{column}.jpg",
      "colCount": 5,
      "width": 2560,
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "rowCount": 5,
      "height": 2560
     },
     {
      "url": "media/panorama_8D3FB7D2_877A_1996_41D4_7689BB9D7D11_0/u/1/{row}_{column}.jpg",
      "colCount": 3,
      "width": 1536,
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "rowCount": 3,
      "height": 1536
     },
     {
      "url": "media/panorama_8D3FB7D2_877A_1996_41D4_7689BB9D7D11_0/u/2/{row}_{column}.jpg",
      "colCount": 2,
      "width": 1024,
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_8D3FB7D2_877A_1996_41D4_7689BB9D7D11_0/u/3/{row}_{column}.jpg",
      "colCount": 1,
      "width": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "height": 512
     }
    ],
    "class": "ImageResource"
   },
   "right": {
    "levels": [
     {
      "url": "media/panorama_8D3FB7D2_877A_1996_41D4_7689BB9D7D11_0/r/0/{row}_{column}.jpg",
      "colCount": 5,
      "width": 2560,
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "rowCount": 5,
      "height": 2560
     },
     {
      "url": "media/panorama_8D3FB7D2_877A_1996_41D4_7689BB9D7D11_0/r/1/{row}_{column}.jpg",
      "colCount": 3,
      "width": 1536,
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "rowCount": 3,
      "height": 1536
     },
     {
      "url": "media/panorama_8D3FB7D2_877A_1996_41D4_7689BB9D7D11_0/r/2/{row}_{column}.jpg",
      "colCount": 2,
      "width": 1024,
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_8D3FB7D2_877A_1996_41D4_7689BB9D7D11_0/r/3/{row}_{column}.jpg",
      "colCount": 1,
      "width": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "height": 512
     }
    ],
    "class": "ImageResource"
   },
   "back": {
    "levels": [
     {
      "url": "media/panorama_8D3FB7D2_877A_1996_41D4_7689BB9D7D11_0/b/0/{row}_{column}.jpg",
      "colCount": 5,
      "width": 2560,
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "rowCount": 5,
      "height": 2560
     },
     {
      "url": "media/panorama_8D3FB7D2_877A_1996_41D4_7689BB9D7D11_0/b/1/{row}_{column}.jpg",
      "colCount": 3,
      "width": 1536,
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "rowCount": 3,
      "height": 1536
     },
     {
      "url": "media/panorama_8D3FB7D2_877A_1996_41D4_7689BB9D7D11_0/b/2/{row}_{column}.jpg",
      "colCount": 2,
      "width": 1024,
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_8D3FB7D2_877A_1996_41D4_7689BB9D7D11_0/b/3/{row}_{column}.jpg",
      "colCount": 1,
      "width": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "height": 512
     }
    ],
    "class": "ImageResource"
   },
   "thumbnailUrl": "media/panorama_8D3FB7D2_877A_1996_41D4_7689BB9D7D11_t.jpg",
   "bottom": {
    "levels": [
     {
      "url": "media/panorama_8D3FB7D2_877A_1996_41D4_7689BB9D7D11_0/d/0/{row}_{column}.jpg",
      "colCount": 5,
      "width": 2560,
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "rowCount": 5,
      "height": 2560
     },
     {
      "url": "media/panorama_8D3FB7D2_877A_1996_41D4_7689BB9D7D11_0/d/1/{row}_{column}.jpg",
      "colCount": 3,
      "width": 1536,
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "rowCount": 3,
      "height": 1536
     },
     {
      "url": "media/panorama_8D3FB7D2_877A_1996_41D4_7689BB9D7D11_0/d/2/{row}_{column}.jpg",
      "colCount": 2,
      "width": 1024,
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_8D3FB7D2_877A_1996_41D4_7689BB9D7D11_0/d/3/{row}_{column}.jpg",
      "colCount": 1,
      "width": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "height": 512
     }
    ],
    "class": "ImageResource"
   },
   "class": "CubicPanoramaFrame",
   "left": {
    "levels": [
     {
      "url": "media/panorama_8D3FB7D2_877A_1996_41D4_7689BB9D7D11_0/l/0/{row}_{column}.jpg",
      "colCount": 5,
      "width": 2560,
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "rowCount": 5,
      "height": 2560
     },
     {
      "url": "media/panorama_8D3FB7D2_877A_1996_41D4_7689BB9D7D11_0/l/1/{row}_{column}.jpg",
      "colCount": 3,
      "width": 1536,
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "rowCount": 3,
      "height": 1536
     },
     {
      "url": "media/panorama_8D3FB7D2_877A_1996_41D4_7689BB9D7D11_0/l/2/{row}_{column}.jpg",
      "colCount": 2,
      "width": 1024,
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_8D3FB7D2_877A_1996_41D4_7689BB9D7D11_0/l/3/{row}_{column}.jpg",
      "colCount": 1,
      "width": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "height": 512
     }
    ],
    "class": "ImageResource"
   }
  }
 ],
 "label": "SAM_101_1972",
 "hfovMin": "135%",
 "id": "panorama_8D3FB7D2_877A_1996_41D4_7689BB9D7D11",
 "overlays": [
  "this.panorama_8D3FB7D2_877A_1996_41D4_7689BB9D7D11_tcap0",
  "this.overlay_898AD3B6_873A_199E_41D1_8C930F94CF45",
  "this.overlay_884FD46F_873A_3E8E_41DE_76BEB63330B1"
 ],
 "partial": false,
 "adjacentPanoramas": [
  {
   "panorama": "this.panorama_8D3214D1_874A_3F92_41B8_DE3A41B87CDE",
   "class": "AdjacentPanorama"
  },
  {
   "panorama": "this.panorama_8D277116_877E_F69E_41DF_02AF33F8B702",
   "class": "AdjacentPanorama"
  }
 ],
 "hfov": 360,
 "pitch": 0,
 "class": "Panorama",
 "vfov": 180,
 "thumbnailUrl": "media/panorama_8D3FB7D2_877A_1996_41D4_7689BB9D7D11_t.jpg",
 "hfovMax": 130
},
{
 "frames": [
  {
   "front": {
    "levels": [
     {
      "url": "media/panorama_8D2AB845_875A_36FD_41C5_7712FAF92241_0/f/0/{row}_{column}.jpg",
      "colCount": 5,
      "width": 2560,
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "rowCount": 5,
      "height": 2560
     },
     {
      "url": "media/panorama_8D2AB845_875A_36FD_41C5_7712FAF92241_0/f/1/{row}_{column}.jpg",
      "colCount": 3,
      "width": 1536,
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "rowCount": 3,
      "height": 1536
     },
     {
      "url": "media/panorama_8D2AB845_875A_36FD_41C5_7712FAF92241_0/f/2/{row}_{column}.jpg",
      "colCount": 2,
      "width": 1024,
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_8D2AB845_875A_36FD_41C5_7712FAF92241_0/f/3/{row}_{column}.jpg",
      "colCount": 1,
      "width": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "height": 512
     }
    ],
    "class": "ImageResource"
   },
   "top": {
    "levels": [
     {
      "url": "media/panorama_8D2AB845_875A_36FD_41C5_7712FAF92241_0/u/0/{row}_{column}.jpg",
      "colCount": 5,
      "width": 2560,
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "rowCount": 5,
      "height": 2560
     },
     {
      "url": "media/panorama_8D2AB845_875A_36FD_41C5_7712FAF92241_0/u/1/{row}_{column}.jpg",
      "colCount": 3,
      "width": 1536,
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "rowCount": 3,
      "height": 1536
     },
     {
      "url": "media/panorama_8D2AB845_875A_36FD_41C5_7712FAF92241_0/u/2/{row}_{column}.jpg",
      "colCount": 2,
      "width": 1024,
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_8D2AB845_875A_36FD_41C5_7712FAF92241_0/u/3/{row}_{column}.jpg",
      "colCount": 1,
      "width": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "height": 512
     }
    ],
    "class": "ImageResource"
   },
   "right": {
    "levels": [
     {
      "url": "media/panorama_8D2AB845_875A_36FD_41C5_7712FAF92241_0/r/0/{row}_{column}.jpg",
      "colCount": 5,
      "width": 2560,
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "rowCount": 5,
      "height": 2560
     },
     {
      "url": "media/panorama_8D2AB845_875A_36FD_41C5_7712FAF92241_0/r/1/{row}_{column}.jpg",
      "colCount": 3,
      "width": 1536,
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "rowCount": 3,
      "height": 1536
     },
     {
      "url": "media/panorama_8D2AB845_875A_36FD_41C5_7712FAF92241_0/r/2/{row}_{column}.jpg",
      "colCount": 2,
      "width": 1024,
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_8D2AB845_875A_36FD_41C5_7712FAF92241_0/r/3/{row}_{column}.jpg",
      "colCount": 1,
      "width": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "height": 512
     }
    ],
    "class": "ImageResource"
   },
   "back": {
    "levels": [
     {
      "url": "media/panorama_8D2AB845_875A_36FD_41C5_7712FAF92241_0/b/0/{row}_{column}.jpg",
      "colCount": 5,
      "width": 2560,
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "rowCount": 5,
      "height": 2560
     },
     {
      "url": "media/panorama_8D2AB845_875A_36FD_41C5_7712FAF92241_0/b/1/{row}_{column}.jpg",
      "colCount": 3,
      "width": 1536,
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "rowCount": 3,
      "height": 1536
     },
     {
      "url": "media/panorama_8D2AB845_875A_36FD_41C5_7712FAF92241_0/b/2/{row}_{column}.jpg",
      "colCount": 2,
      "width": 1024,
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_8D2AB845_875A_36FD_41C5_7712FAF92241_0/b/3/{row}_{column}.jpg",
      "colCount": 1,
      "width": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "height": 512
     }
    ],
    "class": "ImageResource"
   },
   "thumbnailUrl": "media/panorama_8D2AB845_875A_36FD_41C5_7712FAF92241_t.jpg",
   "bottom": {
    "levels": [
     {
      "url": "media/panorama_8D2AB845_875A_36FD_41C5_7712FAF92241_0/d/0/{row}_{column}.jpg",
      "colCount": 5,
      "width": 2560,
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "rowCount": 5,
      "height": 2560
     },
     {
      "url": "media/panorama_8D2AB845_875A_36FD_41C5_7712FAF92241_0/d/1/{row}_{column}.jpg",
      "colCount": 3,
      "width": 1536,
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "rowCount": 3,
      "height": 1536
     },
     {
      "url": "media/panorama_8D2AB845_875A_36FD_41C5_7712FAF92241_0/d/2/{row}_{column}.jpg",
      "colCount": 2,
      "width": 1024,
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_8D2AB845_875A_36FD_41C5_7712FAF92241_0/d/3/{row}_{column}.jpg",
      "colCount": 1,
      "width": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "height": 512
     }
    ],
    "class": "ImageResource"
   },
   "class": "CubicPanoramaFrame",
   "left": {
    "levels": [
     {
      "url": "media/panorama_8D2AB845_875A_36FD_41C5_7712FAF92241_0/l/0/{row}_{column}.jpg",
      "colCount": 5,
      "width": 2560,
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "rowCount": 5,
      "height": 2560
     },
     {
      "url": "media/panorama_8D2AB845_875A_36FD_41C5_7712FAF92241_0/l/1/{row}_{column}.jpg",
      "colCount": 3,
      "width": 1536,
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "rowCount": 3,
      "height": 1536
     },
     {
      "url": "media/panorama_8D2AB845_875A_36FD_41C5_7712FAF92241_0/l/2/{row}_{column}.jpg",
      "colCount": 2,
      "width": 1024,
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_8D2AB845_875A_36FD_41C5_7712FAF92241_0/l/3/{row}_{column}.jpg",
      "colCount": 1,
      "width": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "height": 512
     }
    ],
    "class": "ImageResource"
   }
  }
 ],
 "label": "SAM_101_1966",
 "hfovMin": "135%",
 "id": "panorama_8D2AB845_875A_36FD_41C5_7712FAF92241",
 "overlays": [
  "this.panorama_8D2AB845_875A_36FD_41C5_7712FAF92241_tcap0",
  "this.overlay_898E7BC5_873A_29FD_41D1_E5C1F799F17B",
  "this.overlay_883A5940_873A_16F2_41D8_9E9DE41C8DFB"
 ],
 "partial": false,
 "adjacentPanoramas": [
  {
   "yaw": -163.91,
   "class": "AdjacentPanorama",
   "backwardYaw": 174.82,
   "panorama": "this.panorama_8D342236_875E_1A9E_41D1_D2B4A3232FA4",
   "distance": 1
  },
  {
   "panorama": "this.panorama_8D349E28_875A_2AB3_4191_8B7C205E4B8B",
   "class": "AdjacentPanorama"
  }
 ],
 "hfov": 360,
 "pitch": 0,
 "class": "Panorama",
 "vfov": 180,
 "thumbnailUrl": "media/panorama_8D2AB845_875A_36FD_41C5_7712FAF92241_t.jpg",
 "hfovMax": 130
},
{
 "initialPosition": {
  "yaw": 0,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 },
 "initialSequence": {
  "class": "PanoramaCameraSequence",
  "movements": [
   {
    "yawSpeed": 7.96,
    "yawDelta": 18.5,
    "class": "DistancePanoramaCameraMovement",
    "easing": "cubic_in"
   },
   {
    "yawSpeed": 7.96,
    "yawDelta": 323,
    "class": "DistancePanoramaCameraMovement",
    "easing": "linear"
   },
   {
    "yawSpeed": 7.96,
    "yawDelta": 18.5,
    "class": "DistancePanoramaCameraMovement",
    "easing": "cubic_out"
   }
  ],
  "restartMovementOnUserInteraction": false
 },
 "id": "camera_853B957C_8AC4_B638_41D3_3407E4BE1B53",
 "class": "PanoramaCamera",
 "automaticZoomSpeed": 10
},
{
 "initialPosition": {
  "yaw": -71.63,
  "class": "PanoramaCameraPosition",
  "pitch": -5.51
 },
 "initialSequence": {
  "class": "PanoramaCameraSequence",
  "movements": [
   {
    "yawSpeed": 7.96,
    "yawDelta": 18.5,
    "class": "DistancePanoramaCameraMovement",
    "easing": "cubic_in"
   },
   {
    "yawSpeed": 7.96,
    "yawDelta": 323,
    "class": "DistancePanoramaCameraMovement",
    "easing": "linear"
   },
   {
    "yawSpeed": 7.96,
    "yawDelta": 18.5,
    "class": "DistancePanoramaCameraMovement",
    "easing": "cubic_out"
   }
  ],
  "restartMovementOnUserInteraction": false
 },
 "id": "camera_851DD5C5_8AC4_B648_41BC_9E0D063FDF7A",
 "class": "PanoramaCamera",
 "automaticZoomSpeed": 10
},
{
 "frames": [
  {
   "front": {
    "levels": [
     {
      "url": "media/panorama_8D3214D1_874A_3F92_41B8_DE3A41B87CDE_0/f/0/{row}_{column}.jpg",
      "colCount": 5,
      "width": 2560,
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "rowCount": 5,
      "height": 2560
     },
     {
      "url": "media/panorama_8D3214D1_874A_3F92_41B8_DE3A41B87CDE_0/f/1/{row}_{column}.jpg",
      "colCount": 3,
      "width": 1536,
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "rowCount": 3,
      "height": 1536
     },
     {
      "url": "media/panorama_8D3214D1_874A_3F92_41B8_DE3A41B87CDE_0/f/2/{row}_{column}.jpg",
      "colCount": 2,
      "width": 1024,
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_8D3214D1_874A_3F92_41B8_DE3A41B87CDE_0/f/3/{row}_{column}.jpg",
      "colCount": 1,
      "width": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "height": 512
     }
    ],
    "class": "ImageResource"
   },
   "top": {
    "levels": [
     {
      "url": "media/panorama_8D3214D1_874A_3F92_41B8_DE3A41B87CDE_0/u/0/{row}_{column}.jpg",
      "colCount": 5,
      "width": 2560,
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "rowCount": 5,
      "height": 2560
     },
     {
      "url": "media/panorama_8D3214D1_874A_3F92_41B8_DE3A41B87CDE_0/u/1/{row}_{column}.jpg",
      "colCount": 3,
      "width": 1536,
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "rowCount": 3,
      "height": 1536
     },
     {
      "url": "media/panorama_8D3214D1_874A_3F92_41B8_DE3A41B87CDE_0/u/2/{row}_{column}.jpg",
      "colCount": 2,
      "width": 1024,
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_8D3214D1_874A_3F92_41B8_DE3A41B87CDE_0/u/3/{row}_{column}.jpg",
      "colCount": 1,
      "width": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "height": 512
     }
    ],
    "class": "ImageResource"
   },
   "right": {
    "levels": [
     {
      "url": "media/panorama_8D3214D1_874A_3F92_41B8_DE3A41B87CDE_0/r/0/{row}_{column}.jpg",
      "colCount": 5,
      "width": 2560,
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "rowCount": 5,
      "height": 2560
     },
     {
      "url": "media/panorama_8D3214D1_874A_3F92_41B8_DE3A41B87CDE_0/r/1/{row}_{column}.jpg",
      "colCount": 3,
      "width": 1536,
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "rowCount": 3,
      "height": 1536
     },
     {
      "url": "media/panorama_8D3214D1_874A_3F92_41B8_DE3A41B87CDE_0/r/2/{row}_{column}.jpg",
      "colCount": 2,
      "width": 1024,
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_8D3214D1_874A_3F92_41B8_DE3A41B87CDE_0/r/3/{row}_{column}.jpg",
      "colCount": 1,
      "width": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "height": 512
     }
    ],
    "class": "ImageResource"
   },
   "back": {
    "levels": [
     {
      "url": "media/panorama_8D3214D1_874A_3F92_41B8_DE3A41B87CDE_0/b/0/{row}_{column}.jpg",
      "colCount": 5,
      "width": 2560,
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "rowCount": 5,
      "height": 2560
     },
     {
      "url": "media/panorama_8D3214D1_874A_3F92_41B8_DE3A41B87CDE_0/b/1/{row}_{column}.jpg",
      "colCount": 3,
      "width": 1536,
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "rowCount": 3,
      "height": 1536
     },
     {
      "url": "media/panorama_8D3214D1_874A_3F92_41B8_DE3A41B87CDE_0/b/2/{row}_{column}.jpg",
      "colCount": 2,
      "width": 1024,
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_8D3214D1_874A_3F92_41B8_DE3A41B87CDE_0/b/3/{row}_{column}.jpg",
      "colCount": 1,
      "width": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "height": 512
     }
    ],
    "class": "ImageResource"
   },
   "thumbnailUrl": "media/panorama_8D3214D1_874A_3F92_41B8_DE3A41B87CDE_t.jpg",
   "bottom": {
    "levels": [
     {
      "url": "media/panorama_8D3214D1_874A_3F92_41B8_DE3A41B87CDE_0/d/0/{row}_{column}.jpg",
      "colCount": 5,
      "width": 2560,
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "rowCount": 5,
      "height": 2560
     },
     {
      "url": "media/panorama_8D3214D1_874A_3F92_41B8_DE3A41B87CDE_0/d/1/{row}_{column}.jpg",
      "colCount": 3,
      "width": 1536,
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "rowCount": 3,
      "height": 1536
     },
     {
      "url": "media/panorama_8D3214D1_874A_3F92_41B8_DE3A41B87CDE_0/d/2/{row}_{column}.jpg",
      "colCount": 2,
      "width": 1024,
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_8D3214D1_874A_3F92_41B8_DE3A41B87CDE_0/d/3/{row}_{column}.jpg",
      "colCount": 1,
      "width": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "height": 512
     }
    ],
    "class": "ImageResource"
   },
   "class": "CubicPanoramaFrame",
   "left": {
    "levels": [
     {
      "url": "media/panorama_8D3214D1_874A_3F92_41B8_DE3A41B87CDE_0/l/0/{row}_{column}.jpg",
      "colCount": 5,
      "width": 2560,
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "rowCount": 5,
      "height": 2560
     },
     {
      "url": "media/panorama_8D3214D1_874A_3F92_41B8_DE3A41B87CDE_0/l/1/{row}_{column}.jpg",
      "colCount": 3,
      "width": 1536,
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "rowCount": 3,
      "height": 1536
     },
     {
      "url": "media/panorama_8D3214D1_874A_3F92_41B8_DE3A41B87CDE_0/l/2/{row}_{column}.jpg",
      "colCount": 2,
      "width": 1024,
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_8D3214D1_874A_3F92_41B8_DE3A41B87CDE_0/l/3/{row}_{column}.jpg",
      "colCount": 1,
      "width": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "height": 512
     }
    ],
    "class": "ImageResource"
   }
  }
 ],
 "label": "SAM_101_1969",
 "hfovMin": "135%",
 "id": "panorama_8D3214D1_874A_3F92_41B8_DE3A41B87CDE",
 "overlays": [
  "this.panorama_8D3214D1_874A_3F92_41B8_DE3A41B87CDE_tcap0",
  "this.overlay_8989F8F5_873A_1792_41D7_AFB72BACFE62",
  "this.overlay_88308247_873B_FAFE_41E0_83A746A3CA0A",
  "this.overlay_88E579F5_873A_2992_41D2_7839F5DBE953"
 ],
 "partial": false,
 "adjacentPanoramas": [
  {
   "panorama": "this.panorama_8D26FEDC_874A_2B92_41BD_9E25154EBA39",
   "class": "AdjacentPanorama"
  },
  {
   "panorama": "this.panorama_8D012E2E_874A_2A8E_4191_30904C062B4B",
   "class": "AdjacentPanorama"
  },
  {
   "panorama": "this.panorama_8D3FB7D2_877A_1996_41D4_7689BB9D7D11",
   "class": "AdjacentPanorama"
  }
 ],
 "hfov": 360,
 "pitch": 0,
 "class": "Panorama",
 "vfov": 180,
 "thumbnailUrl": "media/panorama_8D3214D1_874A_3F92_41B8_DE3A41B87CDE_t.jpg",
 "hfovMax": 130
},
{
 "initialPosition": {
  "yaw": -120.31,
  "class": "PanoramaCameraPosition",
  "pitch": 4.59
 },
 "initialSequence": {
  "class": "PanoramaCameraSequence",
  "movements": [
   {
    "yawSpeed": 7.96,
    "yawDelta": 18.5,
    "class": "DistancePanoramaCameraMovement",
    "easing": "cubic_in"
   },
   {
    "yawSpeed": 7.96,
    "yawDelta": 323,
    "class": "DistancePanoramaCameraMovement",
    "easing": "linear"
   },
   {
    "yawSpeed": 7.96,
    "yawDelta": 18.5,
    "class": "DistancePanoramaCameraMovement",
    "easing": "cubic_out"
   }
  ],
  "restartMovementOnUserInteraction": false
 },
 "id": "camera_846F46B2_8AC4_B2C8_41BE_474F8FB78CFE",
 "class": "PanoramaCamera",
 "automaticZoomSpeed": 10
},
{
 "frames": [
  {
   "front": {
    "levels": [
     {
      "url": "media/panorama_8D26F0D5_874A_1792_41C4_D544048ED703_0/f/0/{row}_{column}.jpg",
      "colCount": 5,
      "width": 2560,
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "rowCount": 5,
      "height": 2560
     },
     {
      "url": "media/panorama_8D26F0D5_874A_1792_41C4_D544048ED703_0/f/1/{row}_{column}.jpg",
      "colCount": 3,
      "width": 1536,
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "rowCount": 3,
      "height": 1536
     },
     {
      "url": "media/panorama_8D26F0D5_874A_1792_41C4_D544048ED703_0/f/2/{row}_{column}.jpg",
      "colCount": 2,
      "width": 1024,
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_8D26F0D5_874A_1792_41C4_D544048ED703_0/f/3/{row}_{column}.jpg",
      "colCount": 1,
      "width": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "height": 512
     }
    ],
    "class": "ImageResource"
   },
   "top": {
    "levels": [
     {
      "url": "media/panorama_8D26F0D5_874A_1792_41C4_D544048ED703_0/u/0/{row}_{column}.jpg",
      "colCount": 5,
      "width": 2560,
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "rowCount": 5,
      "height": 2560
     },
     {
      "url": "media/panorama_8D26F0D5_874A_1792_41C4_D544048ED703_0/u/1/{row}_{column}.jpg",
      "colCount": 3,
      "width": 1536,
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "rowCount": 3,
      "height": 1536
     },
     {
      "url": "media/panorama_8D26F0D5_874A_1792_41C4_D544048ED703_0/u/2/{row}_{column}.jpg",
      "colCount": 2,
      "width": 1024,
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_8D26F0D5_874A_1792_41C4_D544048ED703_0/u/3/{row}_{column}.jpg",
      "colCount": 1,
      "width": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "height": 512
     }
    ],
    "class": "ImageResource"
   },
   "right": {
    "levels": [
     {
      "url": "media/panorama_8D26F0D5_874A_1792_41C4_D544048ED703_0/r/0/{row}_{column}.jpg",
      "colCount": 5,
      "width": 2560,
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "rowCount": 5,
      "height": 2560
     },
     {
      "url": "media/panorama_8D26F0D5_874A_1792_41C4_D544048ED703_0/r/1/{row}_{column}.jpg",
      "colCount": 3,
      "width": 1536,
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "rowCount": 3,
      "height": 1536
     },
     {
      "url": "media/panorama_8D26F0D5_874A_1792_41C4_D544048ED703_0/r/2/{row}_{column}.jpg",
      "colCount": 2,
      "width": 1024,
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_8D26F0D5_874A_1792_41C4_D544048ED703_0/r/3/{row}_{column}.jpg",
      "colCount": 1,
      "width": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "height": 512
     }
    ],
    "class": "ImageResource"
   },
   "back": {
    "levels": [
     {
      "url": "media/panorama_8D26F0D5_874A_1792_41C4_D544048ED703_0/b/0/{row}_{column}.jpg",
      "colCount": 5,
      "width": 2560,
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "rowCount": 5,
      "height": 2560
     },
     {
      "url": "media/panorama_8D26F0D5_874A_1792_41C4_D544048ED703_0/b/1/{row}_{column}.jpg",
      "colCount": 3,
      "width": 1536,
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "rowCount": 3,
      "height": 1536
     },
     {
      "url": "media/panorama_8D26F0D5_874A_1792_41C4_D544048ED703_0/b/2/{row}_{column}.jpg",
      "colCount": 2,
      "width": 1024,
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_8D26F0D5_874A_1792_41C4_D544048ED703_0/b/3/{row}_{column}.jpg",
      "colCount": 1,
      "width": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "height": 512
     }
    ],
    "class": "ImageResource"
   },
   "thumbnailUrl": "media/panorama_8D26F0D5_874A_1792_41C4_D544048ED703_t.jpg",
   "bottom": {
    "levels": [
     {
      "url": "media/panorama_8D26F0D5_874A_1792_41C4_D544048ED703_0/d/0/{row}_{column}.jpg",
      "colCount": 5,
      "width": 2560,
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "rowCount": 5,
      "height": 2560
     },
     {
      "url": "media/panorama_8D26F0D5_874A_1792_41C4_D544048ED703_0/d/1/{row}_{column}.jpg",
      "colCount": 3,
      "width": 1536,
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "rowCount": 3,
      "height": 1536
     },
     {
      "url": "media/panorama_8D26F0D5_874A_1792_41C4_D544048ED703_0/d/2/{row}_{column}.jpg",
      "colCount": 2,
      "width": 1024,
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_8D26F0D5_874A_1792_41C4_D544048ED703_0/d/3/{row}_{column}.jpg",
      "colCount": 1,
      "width": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "height": 512
     }
    ],
    "class": "ImageResource"
   },
   "class": "CubicPanoramaFrame",
   "left": {
    "levels": [
     {
      "url": "media/panorama_8D26F0D5_874A_1792_41C4_D544048ED703_0/l/0/{row}_{column}.jpg",
      "colCount": 5,
      "width": 2560,
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "rowCount": 5,
      "height": 2560
     },
     {
      "url": "media/panorama_8D26F0D5_874A_1792_41C4_D544048ED703_0/l/1/{row}_{column}.jpg",
      "colCount": 3,
      "width": 1536,
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "rowCount": 3,
      "height": 1536
     },
     {
      "url": "media/panorama_8D26F0D5_874A_1792_41C4_D544048ED703_0/l/2/{row}_{column}.jpg",
      "colCount": 2,
      "width": 1024,
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_8D26F0D5_874A_1792_41C4_D544048ED703_0/l/3/{row}_{column}.jpg",
      "colCount": 1,
      "width": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "height": 512
     }
    ],
    "class": "ImageResource"
   }
  }
 ],
 "label": "SAM_101_1962",
 "hfovMin": "135%",
 "id": "panorama_8D26F0D5_874A_1792_41C4_D544048ED703",
 "overlays": [
  "this.panorama_8D26F0D5_874A_1792_41C4_D544048ED703_tcap0",
  "this.overlay_8887D315_873E_1A9D_41E0_C97988501BE8",
  "this.overlay_883BD93D_873E_3692_41DD_BF676C27100C",
  "this.overlay_88E987BD_873E_7992_41D5_0E4DAA72685F"
 ],
 "partial": false,
 "adjacentPanoramas": [
  {
   "panorama": "this.panorama_8D2E44C5_875A_FFF2_41D2_998B2388C555",
   "class": "AdjacentPanorama"
  },
  {
   "panorama": "this.panorama_8D330B1E_874E_6A8E_41D2_0A89F6F28F55",
   "class": "AdjacentPanorama"
  },
  {
   "panorama": "this.panorama_8D23D510_8746_1E92_41AA_543AD4625D58",
   "class": "AdjacentPanorama"
  }
 ],
 "hfov": 360,
 "pitch": 0,
 "class": "Panorama",
 "vfov": 180,
 "thumbnailUrl": "media/panorama_8D26F0D5_874A_1792_41C4_D544048ED703_t.jpg",
 "hfovMax": 130
},
{
 "frames": [
  {
   "front": {
    "levels": [
     {
      "url": "media/panorama_8D23D510_8746_1E92_41AA_543AD4625D58_0/f/0/{row}_{column}.jpg",
      "colCount": 5,
      "width": 2560,
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "rowCount": 5,
      "height": 2560
     },
     {
      "url": "media/panorama_8D23D510_8746_1E92_41AA_543AD4625D58_0/f/1/{row}_{column}.jpg",
      "colCount": 3,
      "width": 1536,
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "rowCount": 3,
      "height": 1536
     },
     {
      "url": "media/panorama_8D23D510_8746_1E92_41AA_543AD4625D58_0/f/2/{row}_{column}.jpg",
      "colCount": 2,
      "width": 1024,
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_8D23D510_8746_1E92_41AA_543AD4625D58_0/f/3/{row}_{column}.jpg",
      "colCount": 1,
      "width": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "height": 512
     }
    ],
    "class": "ImageResource"
   },
   "top": {
    "levels": [
     {
      "url": "media/panorama_8D23D510_8746_1E92_41AA_543AD4625D58_0/u/0/{row}_{column}.jpg",
      "colCount": 5,
      "width": 2560,
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "rowCount": 5,
      "height": 2560
     },
     {
      "url": "media/panorama_8D23D510_8746_1E92_41AA_543AD4625D58_0/u/1/{row}_{column}.jpg",
      "colCount": 3,
      "width": 1536,
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "rowCount": 3,
      "height": 1536
     },
     {
      "url": "media/panorama_8D23D510_8746_1E92_41AA_543AD4625D58_0/u/2/{row}_{column}.jpg",
      "colCount": 2,
      "width": 1024,
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_8D23D510_8746_1E92_41AA_543AD4625D58_0/u/3/{row}_{column}.jpg",
      "colCount": 1,
      "width": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "height": 512
     }
    ],
    "class": "ImageResource"
   },
   "right": {
    "levels": [
     {
      "url": "media/panorama_8D23D510_8746_1E92_41AA_543AD4625D58_0/r/0/{row}_{column}.jpg",
      "colCount": 5,
      "width": 2560,
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "rowCount": 5,
      "height": 2560
     },
     {
      "url": "media/panorama_8D23D510_8746_1E92_41AA_543AD4625D58_0/r/1/{row}_{column}.jpg",
      "colCount": 3,
      "width": 1536,
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "rowCount": 3,
      "height": 1536
     },
     {
      "url": "media/panorama_8D23D510_8746_1E92_41AA_543AD4625D58_0/r/2/{row}_{column}.jpg",
      "colCount": 2,
      "width": 1024,
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_8D23D510_8746_1E92_41AA_543AD4625D58_0/r/3/{row}_{column}.jpg",
      "colCount": 1,
      "width": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "height": 512
     }
    ],
    "class": "ImageResource"
   },
   "back": {
    "levels": [
     {
      "url": "media/panorama_8D23D510_8746_1E92_41AA_543AD4625D58_0/b/0/{row}_{column}.jpg",
      "colCount": 5,
      "width": 2560,
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "rowCount": 5,
      "height": 2560
     },
     {
      "url": "media/panorama_8D23D510_8746_1E92_41AA_543AD4625D58_0/b/1/{row}_{column}.jpg",
      "colCount": 3,
      "width": 1536,
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "rowCount": 3,
      "height": 1536
     },
     {
      "url": "media/panorama_8D23D510_8746_1E92_41AA_543AD4625D58_0/b/2/{row}_{column}.jpg",
      "colCount": 2,
      "width": 1024,
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_8D23D510_8746_1E92_41AA_543AD4625D58_0/b/3/{row}_{column}.jpg",
      "colCount": 1,
      "width": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "height": 512
     }
    ],
    "class": "ImageResource"
   },
   "thumbnailUrl": "media/panorama_8D23D510_8746_1E92_41AA_543AD4625D58_t.jpg",
   "bottom": {
    "levels": [
     {
      "url": "media/panorama_8D23D510_8746_1E92_41AA_543AD4625D58_0/d/0/{row}_{column}.jpg",
      "colCount": 5,
      "width": 2560,
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "rowCount": 5,
      "height": 2560
     },
     {
      "url": "media/panorama_8D23D510_8746_1E92_41AA_543AD4625D58_0/d/1/{row}_{column}.jpg",
      "colCount": 3,
      "width": 1536,
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "rowCount": 3,
      "height": 1536
     },
     {
      "url": "media/panorama_8D23D510_8746_1E92_41AA_543AD4625D58_0/d/2/{row}_{column}.jpg",
      "colCount": 2,
      "width": 1024,
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_8D23D510_8746_1E92_41AA_543AD4625D58_0/d/3/{row}_{column}.jpg",
      "colCount": 1,
      "width": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "height": 512
     }
    ],
    "class": "ImageResource"
   },
   "class": "CubicPanoramaFrame",
   "left": {
    "levels": [
     {
      "url": "media/panorama_8D23D510_8746_1E92_41AA_543AD4625D58_0/l/0/{row}_{column}.jpg",
      "colCount": 5,
      "width": 2560,
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "rowCount": 5,
      "height": 2560
     },
     {
      "url": "media/panorama_8D23D510_8746_1E92_41AA_543AD4625D58_0/l/1/{row}_{column}.jpg",
      "colCount": 3,
      "width": 1536,
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "rowCount": 3,
      "height": 1536
     },
     {
      "url": "media/panorama_8D23D510_8746_1E92_41AA_543AD4625D58_0/l/2/{row}_{column}.jpg",
      "colCount": 2,
      "width": 1024,
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_8D23D510_8746_1E92_41AA_543AD4625D58_0/l/3/{row}_{column}.jpg",
      "colCount": 1,
      "width": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "height": 512
     }
    ],
    "class": "ImageResource"
   }
  }
 ],
 "label": "SAM_101_1961",
 "hfovMin": "135%",
 "id": "panorama_8D23D510_8746_1E92_41AA_543AD4625D58",
 "overlays": [
  "this.panorama_8D23D510_8746_1E92_41AA_543AD4625D58_tcap0",
  "this.overlay_8853E136_873E_169E_41D1_9DEAB7DB5E91",
  "this.overlay_88175395_873E_7992_41D0_AE046DDF6EA2",
  "this.overlay_899C4A66_873E_2ABE_4190_9E8D5AA5E623"
 ],
 "partial": false,
 "adjacentPanoramas": [
  {
   "panorama": "this.panorama_8C698C0B_873E_2E76_41D9_D763A36BC981",
   "class": "AdjacentPanorama"
  },
  {
   "panorama": "this.panorama_8D26FEDC_874A_2B92_41BD_9E25154EBA39",
   "class": "AdjacentPanorama"
  },
  {
   "panorama": "this.panorama_8D26F0D5_874A_1792_41C4_D544048ED703",
   "class": "AdjacentPanorama"
  }
 ],
 "hfov": 360,
 "pitch": 0,
 "class": "Panorama",
 "vfov": 180,
 "thumbnailUrl": "media/panorama_8D23D510_8746_1E92_41AA_543AD4625D58_t.jpg",
 "hfovMax": 130
},
{
 "initialPosition": {
  "yaw": 0,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 },
 "initialSequence": {
  "class": "PanoramaCameraSequence",
  "movements": [
   {
    "yawSpeed": 7.96,
    "yawDelta": 18.5,
    "class": "DistancePanoramaCameraMovement",
    "easing": "cubic_in"
   },
   {
    "yawSpeed": 7.96,
    "yawDelta": 323,
    "class": "DistancePanoramaCameraMovement",
    "easing": "linear"
   },
   {
    "yawSpeed": 7.96,
    "yawDelta": 18.5,
    "class": "DistancePanoramaCameraMovement",
    "easing": "cubic_out"
   }
  ],
  "restartMovementOnUserInteraction": false
 },
 "id": "panorama_8D342236_875E_1A9E_41D1_D2B4A3232FA4_camera",
 "class": "PanoramaCamera",
 "automaticZoomSpeed": 10
},
{
 "frames": [
  {
   "front": {
    "levels": [
     {
      "url": "media/panorama_8D330B1E_874E_6A8E_41D2_0A89F6F28F55_0/f/0/{row}_{column}.jpg",
      "colCount": 5,
      "width": 2560,
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "rowCount": 5,
      "height": 2560
     },
     {
      "url": "media/panorama_8D330B1E_874E_6A8E_41D2_0A89F6F28F55_0/f/1/{row}_{column}.jpg",
      "colCount": 3,
      "width": 1536,
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "rowCount": 3,
      "height": 1536
     },
     {
      "url": "media/panorama_8D330B1E_874E_6A8E_41D2_0A89F6F28F55_0/f/2/{row}_{column}.jpg",
      "colCount": 2,
      "width": 1024,
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_8D330B1E_874E_6A8E_41D2_0A89F6F28F55_0/f/3/{row}_{column}.jpg",
      "colCount": 1,
      "width": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "height": 512
     }
    ],
    "class": "ImageResource"
   },
   "top": {
    "levels": [
     {
      "url": "media/panorama_8D330B1E_874E_6A8E_41D2_0A89F6F28F55_0/u/0/{row}_{column}.jpg",
      "colCount": 5,
      "width": 2560,
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "rowCount": 5,
      "height": 2560
     },
     {
      "url": "media/panorama_8D330B1E_874E_6A8E_41D2_0A89F6F28F55_0/u/1/{row}_{column}.jpg",
      "colCount": 3,
      "width": 1536,
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "rowCount": 3,
      "height": 1536
     },
     {
      "url": "media/panorama_8D330B1E_874E_6A8E_41D2_0A89F6F28F55_0/u/2/{row}_{column}.jpg",
      "colCount": 2,
      "width": 1024,
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_8D330B1E_874E_6A8E_41D2_0A89F6F28F55_0/u/3/{row}_{column}.jpg",
      "colCount": 1,
      "width": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "height": 512
     }
    ],
    "class": "ImageResource"
   },
   "right": {
    "levels": [
     {
      "url": "media/panorama_8D330B1E_874E_6A8E_41D2_0A89F6F28F55_0/r/0/{row}_{column}.jpg",
      "colCount": 5,
      "width": 2560,
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "rowCount": 5,
      "height": 2560
     },
     {
      "url": "media/panorama_8D330B1E_874E_6A8E_41D2_0A89F6F28F55_0/r/1/{row}_{column}.jpg",
      "colCount": 3,
      "width": 1536,
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "rowCount": 3,
      "height": 1536
     },
     {
      "url": "media/panorama_8D330B1E_874E_6A8E_41D2_0A89F6F28F55_0/r/2/{row}_{column}.jpg",
      "colCount": 2,
      "width": 1024,
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_8D330B1E_874E_6A8E_41D2_0A89F6F28F55_0/r/3/{row}_{column}.jpg",
      "colCount": 1,
      "width": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "height": 512
     }
    ],
    "class": "ImageResource"
   },
   "back": {
    "levels": [
     {
      "url": "media/panorama_8D330B1E_874E_6A8E_41D2_0A89F6F28F55_0/b/0/{row}_{column}.jpg",
      "colCount": 5,
      "width": 2560,
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "rowCount": 5,
      "height": 2560
     },
     {
      "url": "media/panorama_8D330B1E_874E_6A8E_41D2_0A89F6F28F55_0/b/1/{row}_{column}.jpg",
      "colCount": 3,
      "width": 1536,
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "rowCount": 3,
      "height": 1536
     },
     {
      "url": "media/panorama_8D330B1E_874E_6A8E_41D2_0A89F6F28F55_0/b/2/{row}_{column}.jpg",
      "colCount": 2,
      "width": 1024,
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_8D330B1E_874E_6A8E_41D2_0A89F6F28F55_0/b/3/{row}_{column}.jpg",
      "colCount": 1,
      "width": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "height": 512
     }
    ],
    "class": "ImageResource"
   },
   "thumbnailUrl": "media/panorama_8D330B1E_874E_6A8E_41D2_0A89F6F28F55_t.jpg",
   "bottom": {
    "levels": [
     {
      "url": "media/panorama_8D330B1E_874E_6A8E_41D2_0A89F6F28F55_0/d/0/{row}_{column}.jpg",
      "colCount": 5,
      "width": 2560,
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "rowCount": 5,
      "height": 2560
     },
     {
      "url": "media/panorama_8D330B1E_874E_6A8E_41D2_0A89F6F28F55_0/d/1/{row}_{column}.jpg",
      "colCount": 3,
      "width": 1536,
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "rowCount": 3,
      "height": 1536
     },
     {
      "url": "media/panorama_8D330B1E_874E_6A8E_41D2_0A89F6F28F55_0/d/2/{row}_{column}.jpg",
      "colCount": 2,
      "width": 1024,
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_8D330B1E_874E_6A8E_41D2_0A89F6F28F55_0/d/3/{row}_{column}.jpg",
      "colCount": 1,
      "width": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "height": 512
     }
    ],
    "class": "ImageResource"
   },
   "class": "CubicPanoramaFrame",
   "left": {
    "levels": [
     {
      "url": "media/panorama_8D330B1E_874E_6A8E_41D2_0A89F6F28F55_0/l/0/{row}_{column}.jpg",
      "colCount": 5,
      "width": 2560,
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "rowCount": 5,
      "height": 2560
     },
     {
      "url": "media/panorama_8D330B1E_874E_6A8E_41D2_0A89F6F28F55_0/l/1/{row}_{column}.jpg",
      "colCount": 3,
      "width": 1536,
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "rowCount": 3,
      "height": 1536
     },
     {
      "url": "media/panorama_8D330B1E_874E_6A8E_41D2_0A89F6F28F55_0/l/2/{row}_{column}.jpg",
      "colCount": 2,
      "width": 1024,
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_8D330B1E_874E_6A8E_41D2_0A89F6F28F55_0/l/3/{row}_{column}.jpg",
      "colCount": 1,
      "width": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "height": 512
     }
    ],
    "class": "ImageResource"
   }
  }
 ],
 "label": "SAM_101_1963",
 "hfovMin": "135%",
 "id": "panorama_8D330B1E_874E_6A8E_41D2_0A89F6F28F55",
 "overlays": [
  "this.panorama_8D330B1E_874E_6A8E_41D2_0A89F6F28F55_tcap0",
  "this.overlay_884AA93F_873E_368E_41D6_45EE36F198F6",
  "this.overlay_880B0A55_873E_EA92_41CA_06FEF9CF3EFB"
 ],
 "partial": false,
 "adjacentPanoramas": [
  {
   "panorama": "this.panorama_8D26F0D5_874A_1792_41C4_D544048ED703",
   "class": "AdjacentPanorama"
  },
  {
   "panorama": "this.panorama_8D265541_874A_FEF2_41DE_A0BC495C5419",
   "class": "AdjacentPanorama"
  }
 ],
 "hfov": 360,
 "pitch": 0,
 "class": "Panorama",
 "vfov": 180,
 "thumbnailUrl": "media/panorama_8D330B1E_874E_6A8E_41D2_0A89F6F28F55_t.jpg",
 "hfovMax": 130
},
{
 "initialPosition": {
  "yaw": 0,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 },
 "initialSequence": {
  "class": "PanoramaCameraSequence",
  "movements": [
   {
    "yawSpeed": 7.96,
    "yawDelta": 18.5,
    "class": "DistancePanoramaCameraMovement",
    "easing": "cubic_in"
   },
   {
    "yawSpeed": 7.96,
    "yawDelta": 323,
    "class": "DistancePanoramaCameraMovement",
    "easing": "linear"
   },
   {
    "yawSpeed": 7.96,
    "yawDelta": 18.5,
    "class": "DistancePanoramaCameraMovement",
    "easing": "cubic_out"
   }
  ],
  "restartMovementOnUserInteraction": false
 },
 "id": "panorama_8D1FC4A9_8746_1FB2_4199_50FEC28B1F42_camera",
 "class": "PanoramaCamera",
 "automaticZoomSpeed": 10
},
{
 "initialPosition": {
  "yaw": -89.08,
  "class": "PanoramaCameraPosition",
  "pitch": -4.59
 },
 "initialSequence": {
  "class": "PanoramaCameraSequence",
  "movements": [
   {
    "yawSpeed": 7.96,
    "yawDelta": 18.5,
    "class": "DistancePanoramaCameraMovement",
    "easing": "cubic_in"
   },
   {
    "yawSpeed": 7.96,
    "yawDelta": 323,
    "class": "DistancePanoramaCameraMovement",
    "easing": "linear"
   },
   {
    "yawSpeed": 7.96,
    "yawDelta": 18.5,
    "class": "DistancePanoramaCameraMovement",
    "easing": "cubic_out"
   }
  ],
  "restartMovementOnUserInteraction": false
 },
 "id": "camera_85AB0770_8AC4_B249_41CE_F43F98BF73F9",
 "class": "PanoramaCamera",
 "automaticZoomSpeed": 10
},
{
 "initialPosition": {
  "yaw": 101.02,
  "class": "PanoramaCameraPosition",
  "pitch": -10.1
 },
 "initialSequence": {
  "class": "PanoramaCameraSequence",
  "movements": [
   {
    "yawSpeed": 7.96,
    "yawDelta": 18.5,
    "class": "DistancePanoramaCameraMovement",
    "easing": "cubic_in"
   },
   {
    "yawSpeed": 7.96,
    "yawDelta": 323,
    "class": "DistancePanoramaCameraMovement",
    "easing": "linear"
   },
   {
    "yawSpeed": 7.96,
    "yawDelta": 18.5,
    "class": "DistancePanoramaCameraMovement",
    "easing": "cubic_out"
   }
  ],
  "restartMovementOnUserInteraction": false
 },
 "id": "camera_85E624AF_8AC4_B6D7_41DC_0E72F7359297",
 "class": "PanoramaCamera",
 "automaticZoomSpeed": 10
},
{
 "initialPosition": {
  "yaw": 0,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 },
 "initialSequence": {
  "class": "PanoramaCameraSequence",
  "movements": [
   {
    "yawSpeed": 7.96,
    "yawDelta": 18.5,
    "class": "DistancePanoramaCameraMovement",
    "easing": "cubic_in"
   },
   {
    "yawSpeed": 7.96,
    "yawDelta": 323,
    "class": "DistancePanoramaCameraMovement",
    "easing": "linear"
   },
   {
    "yawSpeed": 7.96,
    "yawDelta": 18.5,
    "class": "DistancePanoramaCameraMovement",
    "easing": "cubic_out"
   }
  ],
  "restartMovementOnUserInteraction": false
 },
 "id": "panorama_8D3214D1_874A_3F92_41B8_DE3A41B87CDE_camera",
 "class": "PanoramaCamera",
 "automaticZoomSpeed": 10
},
{
 "initialPosition": {
  "yaw": 83.57,
  "class": "PanoramaCameraPosition",
  "pitch": -6.43
 },
 "initialSequence": {
  "class": "PanoramaCameraSequence",
  "movements": [
   {
    "yawSpeed": 7.96,
    "yawDelta": 18.5,
    "class": "DistancePanoramaCameraMovement",
    "easing": "cubic_in"
   },
   {
    "yawSpeed": 7.96,
    "yawDelta": 323,
    "class": "DistancePanoramaCameraMovement",
    "easing": "linear"
   },
   {
    "yawSpeed": 7.96,
    "yawDelta": 18.5,
    "class": "DistancePanoramaCameraMovement",
    "easing": "cubic_out"
   }
  ],
  "restartMovementOnUserInteraction": false
 },
 "id": "camera_9A847662_8AC4_B248_41DF_D07E4C9371F7",
 "class": "PanoramaCamera",
 "automaticZoomSpeed": 10
},
{
 "initialPosition": {
  "yaw": -104.69,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 },
 "initialSequence": {
  "class": "PanoramaCameraSequence",
  "movements": [
   {
    "yawSpeed": 7.96,
    "yawDelta": 18.5,
    "class": "DistancePanoramaCameraMovement",
    "easing": "cubic_in"
   },
   {
    "yawSpeed": 7.96,
    "yawDelta": 323,
    "class": "DistancePanoramaCameraMovement",
    "easing": "linear"
   },
   {
    "yawSpeed": 7.96,
    "yawDelta": 18.5,
    "class": "DistancePanoramaCameraMovement",
    "easing": "cubic_out"
   }
  ],
  "restartMovementOnUserInteraction": false
 },
 "id": "camera_84793707_8AC4_B3C8_41E1_2090479A1CFB",
 "class": "PanoramaCamera",
 "automaticZoomSpeed": 10
},
{
 "frames": [
  {
   "front": {
    "levels": [
     {
      "url": "media/panorama_8D277116_877E_F69E_41DF_02AF33F8B702_0/f/0/{row}_{column}.jpg",
      "colCount": 5,
      "width": 2560,
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "rowCount": 5,
      "height": 2560
     },
     {
      "url": "media/panorama_8D277116_877E_F69E_41DF_02AF33F8B702_0/f/1/{row}_{column}.jpg",
      "colCount": 3,
      "width": 1536,
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "rowCount": 3,
      "height": 1536
     },
     {
      "url": "media/panorama_8D277116_877E_F69E_41DF_02AF33F8B702_0/f/2/{row}_{column}.jpg",
      "colCount": 2,
      "width": 1024,
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_8D277116_877E_F69E_41DF_02AF33F8B702_0/f/3/{row}_{column}.jpg",
      "colCount": 1,
      "width": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "height": 512
     }
    ],
    "class": "ImageResource"
   },
   "top": {
    "levels": [
     {
      "url": "media/panorama_8D277116_877E_F69E_41DF_02AF33F8B702_0/u/0/{row}_{column}.jpg",
      "colCount": 5,
      "width": 2560,
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "rowCount": 5,
      "height": 2560
     },
     {
      "url": "media/panorama_8D277116_877E_F69E_41DF_02AF33F8B702_0/u/1/{row}_{column}.jpg",
      "colCount": 3,
      "width": 1536,
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "rowCount": 3,
      "height": 1536
     },
     {
      "url": "media/panorama_8D277116_877E_F69E_41DF_02AF33F8B702_0/u/2/{row}_{column}.jpg",
      "colCount": 2,
      "width": 1024,
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_8D277116_877E_F69E_41DF_02AF33F8B702_0/u/3/{row}_{column}.jpg",
      "colCount": 1,
      "width": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "height": 512
     }
    ],
    "class": "ImageResource"
   },
   "right": {
    "levels": [
     {
      "url": "media/panorama_8D277116_877E_F69E_41DF_02AF33F8B702_0/r/0/{row}_{column}.jpg",
      "colCount": 5,
      "width": 2560,
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "rowCount": 5,
      "height": 2560
     },
     {
      "url": "media/panorama_8D277116_877E_F69E_41DF_02AF33F8B702_0/r/1/{row}_{column}.jpg",
      "colCount": 3,
      "width": 1536,
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "rowCount": 3,
      "height": 1536
     },
     {
      "url": "media/panorama_8D277116_877E_F69E_41DF_02AF33F8B702_0/r/2/{row}_{column}.jpg",
      "colCount": 2,
      "width": 1024,
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_8D277116_877E_F69E_41DF_02AF33F8B702_0/r/3/{row}_{column}.jpg",
      "colCount": 1,
      "width": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "height": 512
     }
    ],
    "class": "ImageResource"
   },
   "back": {
    "levels": [
     {
      "url": "media/panorama_8D277116_877E_F69E_41DF_02AF33F8B702_0/b/0/{row}_{column}.jpg",
      "colCount": 5,
      "width": 2560,
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "rowCount": 5,
      "height": 2560
     },
     {
      "url": "media/panorama_8D277116_877E_F69E_41DF_02AF33F8B702_0/b/1/{row}_{column}.jpg",
      "colCount": 3,
      "width": 1536,
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "rowCount": 3,
      "height": 1536
     },
     {
      "url": "media/panorama_8D277116_877E_F69E_41DF_02AF33F8B702_0/b/2/{row}_{column}.jpg",
      "colCount": 2,
      "width": 1024,
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_8D277116_877E_F69E_41DF_02AF33F8B702_0/b/3/{row}_{column}.jpg",
      "colCount": 1,
      "width": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "height": 512
     }
    ],
    "class": "ImageResource"
   },
   "thumbnailUrl": "media/panorama_8D277116_877E_F69E_41DF_02AF33F8B702_t.jpg",
   "bottom": {
    "levels": [
     {
      "url": "media/panorama_8D277116_877E_F69E_41DF_02AF33F8B702_0/d/0/{row}_{column}.jpg",
      "colCount": 5,
      "width": 2560,
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "rowCount": 5,
      "height": 2560
     },
     {
      "url": "media/panorama_8D277116_877E_F69E_41DF_02AF33F8B702_0/d/1/{row}_{column}.jpg",
      "colCount": 3,
      "width": 1536,
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "rowCount": 3,
      "height": 1536
     },
     {
      "url": "media/panorama_8D277116_877E_F69E_41DF_02AF33F8B702_0/d/2/{row}_{column}.jpg",
      "colCount": 2,
      "width": 1024,
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_8D277116_877E_F69E_41DF_02AF33F8B702_0/d/3/{row}_{column}.jpg",
      "colCount": 1,
      "width": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "height": 512
     }
    ],
    "class": "ImageResource"
   },
   "class": "CubicPanoramaFrame",
   "left": {
    "levels": [
     {
      "url": "media/panorama_8D277116_877E_F69E_41DF_02AF33F8B702_0/l/0/{row}_{column}.jpg",
      "colCount": 5,
      "width": 2560,
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "rowCount": 5,
      "height": 2560
     },
     {
      "url": "media/panorama_8D277116_877E_F69E_41DF_02AF33F8B702_0/l/1/{row}_{column}.jpg",
      "colCount": 3,
      "width": 1536,
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "rowCount": 3,
      "height": 1536
     },
     {
      "url": "media/panorama_8D277116_877E_F69E_41DF_02AF33F8B702_0/l/2/{row}_{column}.jpg",
      "colCount": 2,
      "width": 1024,
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_8D277116_877E_F69E_41DF_02AF33F8B702_0/l/3/{row}_{column}.jpg",
      "colCount": 1,
      "width": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "height": 512
     }
    ],
    "class": "ImageResource"
   }
  }
 ],
 "label": "SAM_101_1973",
 "hfovMin": "120%",
 "id": "panorama_8D277116_877E_F69E_41DF_02AF33F8B702",
 "overlays": [
  "this.panorama_8D277116_877E_F69E_41DF_02AF33F8B702_tcap0",
  "this.overlay_884DBF24_8739_EAB3_41CA_0FAFED283D41",
  "this.overlay_88E34F41_87C6_2AF5_419D_25C08B2944F1"
 ],
 "partial": false,
 "adjacentPanoramas": [
  {
   "panorama": "this.panorama_8D3CFB4B_877A_6AF6_41CB_7F0920056CFD",
   "class": "AdjacentPanorama"
  }
 ],
 "hfov": 360,
 "pitch": 0,
 "class": "Panorama",
 "vfov": 180,
 "thumbnailUrl": "media/panorama_8D277116_877E_F69E_41DF_02AF33F8B702_t.jpg",
 "hfovMax": 130
},
{
 "class": "PanoramaPlayer",
 "displayPlaybackBar": true,
 "viewerArea": "this.MainViewer",
 "gyroscopeVerticalDraggingEnabled": true,
 "id": "MainViewerPanoramaPlayer",
 "touchControlMode": "drag_rotation",
 "mouseControlMode": "drag_rotation"
},
{
 "initialPosition": {
  "yaw": -8.27,
  "class": "PanoramaCameraPosition",
  "pitch": -0.92
 },
 "initialSequence": {
  "class": "PanoramaCameraSequence",
  "movements": [
   {
    "yawSpeed": 7.96,
    "yawDelta": 18.5,
    "class": "DistancePanoramaCameraMovement",
    "easing": "cubic_in"
   },
   {
    "yawSpeed": 7.96,
    "yawDelta": 323,
    "class": "DistancePanoramaCameraMovement",
    "easing": "linear"
   },
   {
    "yawSpeed": 7.96,
    "yawDelta": 18.5,
    "class": "DistancePanoramaCameraMovement",
    "easing": "cubic_out"
   }
  ],
  "restartMovementOnUserInteraction": false
 },
 "id": "camera_856FC5ED_8AC4_B658_41DD_34D663F3898C",
 "class": "PanoramaCamera",
 "automaticZoomSpeed": 10
},
{
 "paddingLeft": 0,
 "id": "MainViewer",
 "left": 0,
 "playbackBarProgressBorderRadius": 0,
 "playbackBarRight": 0,
 "progressBarBorderSize": 0,
 "playbackBarProgressBorderSize": 0,
 "width": "100%",
 "progressBarBorderRadius": 0,
 "toolTipShadowOpacity": 1,
 "class": "ViewerArea",
 "playbackBarBorderRadius": 0,
 "minHeight": 50,
 "playbackBarProgressBorderColor": "#000000",
 "toolTipFontStyle": "normal",
 "toolTipFontFamily": "Arial",
 "playbackBarHeadBorderColor": "#000000",
 "toolTipTextShadowOpacity": 0,
 "transitionDuration": 500,
 "progressLeft": 0,
 "propagateClick": false,
 "playbackBarHeadBorderSize": 0,
 "playbackBarProgressOpacity": 1,
 "playbackBarHeadBorderRadius": 0,
 "toolTipShadowVerticalLength": 0,
 "playbackBarBorderSize": 0,
 "paddingRight": 0,
 "minWidth": 100,
 "vrPointerSelectionColor": "#FF6600",
 "playbackBarBackgroundOpacity": 1,
 "borderSize": 0,
 "toolTipFontColor": "#606060",
 "toolTipBackgroundColor": "#F6F6F6",
 "playbackBarHeadShadowColor": "#000000",
 "height": "100%",
 "playbackBarHeadBackgroundColor": [
  "#111111",
  "#666666"
 ],
 "vrPointerSelectionTime": 2000,
 "progressRight": 0,
 "progressOpacity": 1,
 "toolTipShadowHorizontalLength": 0,
 "shadow": false,
 "progressBarBackgroundColorDirection": "vertical",
 "firstTransitionDuration": 0,
 "progressBottom": 0,
 "progressHeight": 10,
 "playbackBarHeadShadow": true,
 "playbackBarHeadBackgroundColorDirection": "vertical",
 "progressBackgroundOpacity": 1,
 "playbackBarProgressBackgroundColor": [
  "#3399FF"
 ],
 "playbackBarOpacity": 1,
 "toolTipPaddingRight": 6,
 "playbackBarHeadShadowHorizontalLength": 0,
 "playbackBarHeadShadowOpacity": 0.7,
 "toolTipBorderSize": 1,
 "playbackBarHeadShadowVerticalLength": 0,
 "toolTipPaddingLeft": 6,
 "toolTipPaddingTop": 4,
 "vrPointerColor": "#FFFFFF",
 "toolTipDisplayTime": 600,
 "progressBarOpacity": 1,
 "transitionMode": "blending",
 "progressBorderSize": 0,
 "playbackBarBorderColor": "#FFFFFF",
 "toolTipBorderRadius": 3,
 "borderRadius": 0,
 "displayTooltipInTouchScreens": true,
 "progressBorderRadius": 0,
 "playbackBarProgressBackgroundColorRatios": [
  0
 ],
 "playbackBarLeft": 0,
 "progressBackgroundColorRatios": [
  0
 ],
 "top": 0,
 "playbackBarHeadShadowBlurRadius": 3,
 "playbackBarHeadHeight": 15,
 "playbackBarHeadBackgroundColorRatios": [
  0,
  1
 ],
 "progressBarBorderColor": "#000000",
 "toolTipBorderColor": "#767676",
 "progressBarBackgroundColorRatios": [
  0
 ],
 "progressBackgroundColorDirection": "vertical",
 "toolTipShadowSpread": 0,
 "toolTipShadowBlurRadius": 3,
 "playbackBarBottom": 5,
 "toolTipTextShadowColor": "#000000",
 "progressBorderColor": "#000000",
 "playbackBarHeadOpacity": 1,
 "progressBarBackgroundColor": [
  "#3399FF"
 ],
 "toolTipFontSize": "1.11vmin",
 "paddingBottom": 0,
 "toolTipPaddingBottom": 4,
 "toolTipTextShadowBlurRadius": 3,
 "paddingTop": 0,
 "playbackBarProgressBackgroundColorDirection": "vertical",
 "toolTipShadowColor": "#333333",
 "playbackBarBackgroundColor": [
  "#FFFFFF"
 ],
 "progressBackgroundColor": [
  "#FFFFFF"
 ],
 "toolTipOpacity": 1,
 "playbackBarHeight": 10,
 "data": {
  "name": "Main Viewer"
 },
 "toolTipFontWeight": "normal",
 "playbackBarBackgroundColorDirection": "vertical",
 "playbackBarHeadWidth": 6
},
{
 "maxHeight": 500,
 "horizontalAlign": "center",
 "id": "Image_A9D18088_8B3E_1672_41D7_D19FBDAD6069",
 "left": "0.54%",
 "width": "8%",
 "backgroundOpacity": 0,
 "maxWidth": 500,
 "class": "Image",
 "url": "skin/Image_A9D18088_8B3E_1672_41D7_D19FBDAD6069.png",
 "borderRadius": 0,
 "minHeight": 1,
 "propagateClick": false,
 "top": "3.45%",
 "paddingRight": 0,
 "minWidth": 1,
 "verticalAlign": "middle",
 "borderSize": 0,
 "paddingBottom": 0,
 "height": "15%",
 "click": "this.openLink('https://www.facebook.com/arcadenoegtba?__tn__=%2Cd*F*F-R&eid=ARAkLn-D_51tGNfBSCa4mEmulFSPY28tJU3Ii6MCVEpxkCGNaWlr0B4wR-WltPbmW6sgGJ6YZ0Z23urZ&tn-str=*F', '_blank')",
 "paddingTop": 0,
 "shadow": false,
 "scaleMode": "fit_inside",
 "data": {
  "name": "Image29734"
 },
 "cursor": "hand",
 "paddingLeft": 0
},
{
 "maxHeight": 500,
 "horizontalAlign": "center",
 "id": "Image_A8C11C36_8B3A_6E9E_41C7_F5F7299E18F0",
 "left": "0.71%",
 "width": "8%",
 "backgroundOpacity": 0,
 "maxWidth": 500,
 "class": "Image",
 "url": "skin/Image_A8C11C36_8B3A_6E9E_41C7_F5F7299E18F0.png",
 "borderRadius": 0,
 "minHeight": 1,
 "propagateClick": false,
 "top": "20.07%",
 "paddingRight": 0,
 "minWidth": 1,
 "verticalAlign": "middle",
 "borderSize": 0,
 "paddingBottom": 0,
 "height": "15%",
 "click": "this.openLink('https://www.instagram.com/arca_de_noe_diogo/?hl=pt-br', '_blank')",
 "paddingTop": 0,
 "shadow": false,
 "scaleMode": "fit_inside",
 "data": {
  "name": "Image29928"
 },
 "cursor": "hand",
 "paddingLeft": 0
},
{
 "maxHeight": 1097,
 "horizontalAlign": "center",
 "id": "Image_A925EE7E_8B3B_EA8E_41D4_03CB2C585C40",
 "left": "0.81%",
 "width": "8%",
 "backgroundOpacity": 0,
 "maxWidth": 1092,
 "class": "Image",
 "url": "skin/Image_A925EE7E_8B3B_EA8E_41D4_03CB2C585C40.png",
 "borderRadius": 0,
 "minHeight": 1,
 "propagateClick": false,
 "top": "36.3%",
 "paddingRight": 0,
 "minWidth": 1,
 "verticalAlign": "middle",
 "borderSize": 0,
 "paddingBottom": 0,
 "height": "15%",
 "click": "this.openLink('https://api.whatsapp.com/send?phone=556434954192&text=Ol%C3%A1%20Arca%20de%20No%C3%A9%20Pet%20Shop', '_blank')",
 "paddingTop": 0,
 "shadow": false,
 "scaleMode": "fit_inside",
 "data": {
  "name": "Image29989"
 },
 "cursor": "hand",
 "paddingLeft": 0
},
{
 "maxHeight": 1122,
 "horizontalAlign": "center",
 "id": "Image_A8E4314E_8B3A_368E_41CA_3ECA72C4067B",
 "left": "0.82%",
 "width": "8%",
 "backgroundOpacity": 0,
 "maxWidth": 1069,
 "class": "Image",
 "url": "skin/Image_A8E4314E_8B3A_368E_41CA_3ECA72C4067B.png",
 "borderRadius": 0,
 "minHeight": 1,
 "propagateClick": false,
 "verticalAlign": "middle",
 "bottom": "32.67%",
 "paddingRight": 0,
 "minWidth": 1,
 "borderSize": 0,
 "paddingBottom": 0,
 "height": "15%",
 "click": "this.openLink('https://www.google.com.br/maps/place/Arca+de+No%C3%A9+Pet+Shop/@-18.0066434,-49.367373,17z/data=!3m1!4b1!4m5!3m4!1s0x94a0580810aa11d1:0x81e837bf1c3524a4!8m2!3d-18.0066485!4d-49.3651843?hl=pt-BR', '_blank')",
 "shadow": false,
 "scaleMode": "fit_inside",
 "paddingTop": 0,
 "data": {
  "name": "Image30046"
 },
 "cursor": "hand",
 "paddingLeft": 0
},
{
 "inertia": false,
 "id": "panorama_8D012E2E_874A_2A8E_4191_30904C062B4B_tcap0",
 "angle": 0,
 "distance": 50,
 "rotate": false,
 "hfov": 34.5,
 "class": "TripodCapPanoramaOverlay",
 "image": {
  "levels": [
   {
    "url": "media/panorama_8C698C0B_873E_2E76_41D9_D763A36BC981_tcap0.png",
    "width": 850,
    "class": "ImageResourceLevel",
    "height": 850
   }
  ],
  "class": "ImageResource"
 }
},
{
 "useHandCursor": true,
 "maps": [
  {
   "hfov": 30.52,
   "yaw": -164.32,
   "class": "HotspotPanoramaOverlayMap",
   "image": {
    "levels": [
     {
      "url": "media/panorama_8D012E2E_874A_2A8E_4191_30904C062B4B_0_HS_0_0_0_map.gif",
      "width": 32,
      "class": "ImageResourceLevel",
      "height": 16
     }
    ],
    "class": "ImageResource"
   },
   "pitch": -28.23
  }
 ],
 "class": "HotspotPanoramaOverlay",
 "areas": [
  {
   "click": "this.startPanoramaWithCamera(this.panorama_8D1FC4A9_8746_1FB2_4199_50FEC28B1F42, this.camera_85D87536_8AC4_B7C9_41D9_4C40C39C13C6); this.mainPlayList.set('selectedIndex', 15)",
   "class": "HotspotPanoramaOverlayArea",
   "mapColor": "#FF0000"
  }
 ],
 "rollOverDisplay": false,
 "enabledInCardboard": true,
 "items": [
  {
   "image": "this.AnimatedImageResource_81F4673B_8A44_B23F_41D0_CFDA6883DDDD",
   "pitch": -28.23,
   "hfov": 30.52,
   "class": "HotspotPanoramaOverlayImage",
   "distance": 100,
   "yaw": -164.32
  }
 ],
 "id": "overlay_897F8352_87CA_1A96_41C9_7B12B225809F",
 "data": {
  "label": "Arrow 03a"
 }
},
{
 "useHandCursor": true,
 "maps": [
  {
   "hfov": 29.27,
   "yaw": -72.27,
   "class": "HotspotPanoramaOverlayMap",
   "image": {
    "levels": [
     {
      "url": "media/panorama_8D012E2E_874A_2A8E_4191_30904C062B4B_0_HS_1_0_0_map.gif",
      "width": 32,
      "class": "ImageResourceLevel",
      "height": 16
     }
    ],
    "class": "ImageResource"
   },
   "pitch": -32.32
  }
 ],
 "class": "HotspotPanoramaOverlay",
 "areas": [
  {
   "click": "this.startPanoramaWithCamera(this.panorama_8D3214D1_874A_3F92_41B8_DE3A41B87CDE, this.camera_852B555E_8AC4_B678_41B9_48AF9AD919B6); this.mainPlayList.set('selectedIndex', 9)",
   "class": "HotspotPanoramaOverlayArea",
   "mapColor": "#FF0000"
  }
 ],
 "rollOverDisplay": false,
 "enabledInCardboard": true,
 "items": [
  {
   "image": "this.AnimatedImageResource_81F4273B_8A44_B23F_41C7_367BF834FFB0",
   "pitch": -32.32,
   "hfov": 29.27,
   "class": "HotspotPanoramaOverlayImage",
   "distance": 100,
   "yaw": -72.27
  }
 ],
 "id": "overlay_88B453E4_87CA_39B3_41DD_7D91C417C235",
 "data": {
  "label": "Arrow 03a"
 }
},
{
 "inertia": false,
 "id": "panorama_8D2E44C5_875A_FFF2_41D2_998B2388C555_tcap0",
 "angle": 0,
 "distance": 50,
 "rotate": false,
 "hfov": 34.5,
 "class": "TripodCapPanoramaOverlay",
 "image": {
  "levels": [
   {
    "url": "media/panorama_8C698C0B_873E_2E76_41D9_D763A36BC981_tcap0.png",
    "width": 850,
    "class": "ImageResourceLevel",
    "height": 850
   }
  ],
  "class": "ImageResource"
 }
},
{
 "useHandCursor": true,
 "maps": [
  {
   "hfov": 30.63,
   "yaw": 81.95,
   "class": "HotspotPanoramaOverlayMap",
   "image": {
    "levels": [
     {
      "url": "media/panorama_8D2E44C5_875A_FFF2_41D2_998B2388C555_0_HS_0_0_0_map.gif",
      "width": 32,
      "class": "ImageResourceLevel",
      "height": 16
     }
    ],
    "class": "ImageResource"
   },
   "pitch": -27.82
  }
 ],
 "class": "HotspotPanoramaOverlay",
 "areas": [
  {
   "click": "this.startPanoramaWithCamera(this.panorama_8D342236_875E_1A9E_41D1_D2B4A3232FA4, this.camera_85D77510_8AC4_B7C9_41C7_84DE2F7A28B5); this.mainPlayList.set('selectedIndex', 7)",
   "class": "HotspotPanoramaOverlayArea",
   "mapColor": "#FF0000"
  }
 ],
 "rollOverDisplay": false,
 "enabledInCardboard": true,
 "items": [
  {
   "image": "this.AnimatedImageResource_81FF8735_8A44_B3CB_41DA_DE040443B2FC",
   "pitch": -27.82,
   "hfov": 30.63,
   "class": "HotspotPanoramaOverlayImage",
   "distance": 100,
   "yaw": 81.95
  }
 ],
 "id": "overlay_89909EA0_873A_2BB2_41C0_DA7C4A5CD9FF",
 "data": {
  "label": "Arrow 03a"
 }
},
{
 "useHandCursor": true,
 "maps": [
  {
   "hfov": 18.73,
   "yaw": -104.59,
   "class": "HotspotPanoramaOverlayMap",
   "image": {
    "levels": [
     {
      "url": "media/panorama_8D2E44C5_875A_FFF2_41D2_998B2388C555_0_HS_1_0_0_map.gif",
      "width": 32,
      "class": "ImageResourceLevel",
      "height": 16
     }
    ],
    "class": "ImageResource"
   },
   "pitch": -57.27
  }
 ],
 "class": "HotspotPanoramaOverlay",
 "areas": [
  {
   "click": "this.startPanoramaWithCamera(this.panorama_8D26F0D5_874A_1792_41C4_D544048ED703, this.camera_85C674E8_8AC4_B658_41C7_C41FA49C6C80); this.mainPlayList.set('selectedIndex', 2)",
   "class": "HotspotPanoramaOverlayArea",
   "mapColor": "#FF0000"
  }
 ],
 "rollOverDisplay": false,
 "enabledInCardboard": true,
 "items": [
  {
   "image": "this.AnimatedImageResource_81FF5735_8A44_B3CB_41CF_9C35A91E4DA3",
   "pitch": -57.27,
   "hfov": 18.73,
   "class": "HotspotPanoramaOverlayImage",
   "distance": 100,
   "yaw": -104.59
  }
 ],
 "id": "overlay_88546360_873A_1AB2_41C8_6C2E0F77D5FD",
 "data": {
  "label": "Arrow 03a"
 }
},
{
 "inertia": false,
 "id": "panorama_8D265541_874A_FEF2_41DE_A0BC495C5419_tcap0",
 "angle": 0,
 "distance": 50,
 "rotate": false,
 "hfov": 34.5,
 "class": "TripodCapPanoramaOverlay",
 "image": {
  "levels": [
   {
    "url": "media/panorama_8C698C0B_873E_2E76_41D9_D763A36BC981_tcap0.png",
    "width": 850,
    "class": "ImageResourceLevel",
    "height": 850
   }
  ],
  "class": "ImageResource"
 }
},
{
 "useHandCursor": true,
 "maps": [
  {
   "hfov": 27.88,
   "yaw": 98.73,
   "class": "HotspotPanoramaOverlayMap",
   "image": {
    "levels": [
     {
      "url": "media/panorama_8D265541_874A_FEF2_41DE_A0BC495C5419_0_HS_0_0_0_map.gif",
      "width": 32,
      "class": "ImageResourceLevel",
      "height": 16
     }
    ],
    "class": "ImageResource"
   },
   "pitch": -36.41
  }
 ],
 "class": "HotspotPanoramaOverlay",
 "areas": [
  {
   "click": "this.startPanoramaWithCamera(this.panorama_8D330B1E_874E_6A8E_41D2_0A89F6F28F55, this.camera_853B957C_8AC4_B638_41D3_3407E4BE1B53); this.mainPlayList.set('selectedIndex', 3)",
   "class": "HotspotPanoramaOverlayArea",
   "mapColor": "#FF0000"
  }
 ],
 "rollOverDisplay": false,
 "enabledInCardboard": true,
 "items": [
  {
   "image": "this.AnimatedImageResource_81FE6731_8A44_B3CB_41E0_67773E8E22FA",
   "pitch": -36.41,
   "hfov": 27.88,
   "class": "HotspotPanoramaOverlayImage",
   "distance": 100,
   "yaw": 98.73
  }
 ],
 "id": "overlay_884EC89B_873E_1795_41C9_6F868FC8E640",
 "data": {
  "label": "Arrow 03a"
 }
},
{
 "useHandCursor": true,
 "maps": [
  {
   "hfov": 29.79,
   "yaw": -91.09,
   "class": "HotspotPanoramaOverlayMap",
   "image": {
    "levels": [
     {
      "url": "media/panorama_8D265541_874A_FEF2_41DE_A0BC495C5419_0_HS_1_0_0_map.gif",
      "width": 32,
      "class": "ImageResourceLevel",
      "height": 16
     }
    ],
    "class": "ImageResource"
   },
   "pitch": -30.68
  }
 ],
 "class": "HotspotPanoramaOverlay",
 "areas": [
  {
   "click": "this.startPanoramaWithCamera(this.panorama_8D349E28_875A_2AB3_4191_8B7C205E4B8B, this.camera_850D55A6_8AC4_B6C9_41D6_827629AC72DF); this.mainPlayList.set('selectedIndex', 5)",
   "class": "HotspotPanoramaOverlayArea",
   "mapColor": "#FF0000"
  }
 ],
 "rollOverDisplay": false,
 "enabledInCardboard": true,
 "items": [
  {
   "image": "this.AnimatedImageResource_81FE3732_8A44_B3C9_41DB_4595C47372FC",
   "pitch": -30.68,
   "hfov": 29.79,
   "class": "HotspotPanoramaOverlayImage",
   "distance": 100,
   "yaw": -91.09
  }
 ],
 "id": "overlay_8811695B_873E_3695_41D7_969B5A4F1D77",
 "data": {
  "label": "Arrow 03a"
 }
},
{
 "inertia": false,
 "id": "panorama_8D342236_875E_1A9E_41D1_D2B4A3232FA4_tcap0",
 "angle": 0,
 "distance": 50,
 "rotate": false,
 "hfov": 34.5,
 "class": "TripodCapPanoramaOverlay",
 "image": {
  "levels": [
   {
    "url": "media/panorama_8C698C0B_873E_2E76_41D9_D763A36BC981_tcap0.png",
    "width": 850,
    "class": "ImageResourceLevel",
    "height": 850
   }
  ],
  "class": "ImageResource"
 }
},
{
 "useHandCursor": true,
 "maps": [
  {
   "hfov": 30.52,
   "yaw": 81.95,
   "class": "HotspotPanoramaOverlayMap",
   "image": {
    "levels": [
     {
      "url": "media/panorama_8D342236_875E_1A9E_41D1_D2B4A3232FA4_0_HS_0_0_0_map.gif",
      "width": 32,
      "class": "ImageResourceLevel",
      "height": 16
     }
    ],
    "class": "ImageResource"
   },
   "pitch": -28.23
  }
 ],
 "class": "HotspotPanoramaOverlay",
 "areas": [
  {
   "click": "this.startPanoramaWithCamera(this.panorama_8D3FB7D2_877A_1996_41D4_7689BB9D7D11, this.camera_85BA9478_8AC4_B638_41CA_3F545798AAA6); this.mainPlayList.set('selectedIndex', 12)",
   "class": "HotspotPanoramaOverlayArea",
   "mapColor": "#FF0000"
  }
 ],
 "rollOverDisplay": false,
 "enabledInCardboard": true,
 "items": [
  {
   "image": "this.AnimatedImageResource_81FE3734_8A44_B3C9_41D3_DA94DFE2EBED",
   "pitch": -28.23,
   "hfov": 30.52,
   "class": "HotspotPanoramaOverlayImage",
   "distance": 100,
   "yaw": 81.95
  }
 ],
 "id": "overlay_898C37F3_873A_1996_41DA_3B68BF1B63BE",
 "data": {
  "label": "Arrow 03a"
 }
},
{
 "useHandCursor": true,
 "maps": [
  {
   "hfov": 28.02,
   "yaw": -102.55,
   "class": "HotspotPanoramaOverlayMap",
   "image": {
    "levels": [
     {
      "url": "media/panorama_8D342236_875E_1A9E_41D1_D2B4A3232FA4_0_HS_1_0_0_map.gif",
      "width": 32,
      "class": "ImageResourceLevel",
      "height": 16
     }
    ],
    "class": "ImageResource"
   },
   "pitch": -36
  }
 ],
 "class": "HotspotPanoramaOverlay",
 "areas": [
  {
   "click": "this.startPanoramaWithCamera(this.panorama_8D2E44C5_875A_FFF2_41D2_998B2388C555, this.camera_85B5B469_8AC4_B658_41B3_45B1934C5E8C); this.mainPlayList.set('selectedIndex', 8)",
   "class": "HotspotPanoramaOverlayArea",
   "mapColor": "#FF0000"
  }
 ],
 "rollOverDisplay": false,
 "enabledInCardboard": true,
 "items": [
  {
   "image": "this.AnimatedImageResource_81FE0734_8A44_B3C9_41B5_8EEDE4E83FC0",
   "pitch": -36,
   "hfov": 28.02,
   "class": "HotspotPanoramaOverlayImage",
   "distance": 100,
   "yaw": -102.55
  }
 ],
 "id": "overlay_8853BAA3_873A_2BB5_41E0_2A2226668E4E",
 "data": {
  "label": "Arrow 03a"
 }
},
{
 "useHandCursor": true,
 "maps": [
  {
   "hfov": 28.31,
   "yaw": 174.82,
   "class": "HotspotPanoramaOverlayMap",
   "image": {
    "levels": [
     {
      "url": "media/panorama_8D342236_875E_1A9E_41D1_D2B4A3232FA4_0_HS_2_0_0_map.gif",
      "width": 32,
      "class": "ImageResourceLevel",
      "height": 16
     }
    ],
    "class": "ImageResource"
   },
   "pitch": -35.18
  }
 ],
 "class": "HotspotPanoramaOverlay",
 "areas": [
  {
   "click": "this.startPanoramaWithCamera(this.panorama_8D2AB845_875A_36FD_41C5_7712FAF92241, this.camera_85A06450_8AC4_B648_41B3_0EAA6CF8EC7D); this.mainPlayList.set('selectedIndex', 6)",
   "class": "HotspotPanoramaOverlayArea",
   "mapColor": "#FF0000"
  }
 ],
 "rollOverDisplay": false,
 "enabledInCardboard": true,
 "items": [
  {
   "image": "this.AnimatedImageResource_81FFE735_8A44_B3CB_41D1_C291087D25A8",
   "pitch": -35.18,
   "hfov": 28.31,
   "class": "HotspotPanoramaOverlayImage",
   "distance": 100,
   "yaw": 174.82
  }
 ],
 "id": "overlay_8823E949_873A_16F2_41D2_2F1583895AEF",
 "data": {
  "label": "Arrow 03a"
 }
},
{
 "inertia": false,
 "id": "panorama_8D3CFB4B_877A_6AF6_41CB_7F0920056CFD_tcap0",
 "angle": 0,
 "distance": 50,
 "rotate": false,
 "hfov": 34.5,
 "class": "TripodCapPanoramaOverlay",
 "image": {
  "levels": [
   {
    "url": "media/panorama_8C698C0B_873E_2E76_41D9_D763A36BC981_tcap0.png",
    "width": 850,
    "class": "ImageResourceLevel",
    "height": 850
   }
  ],
  "class": "ImageResource"
 }
},
{
 "useHandCursor": true,
 "maps": [
  {
   "hfov": 30.28,
   "yaw": -147.14,
   "class": "HotspotPanoramaOverlayMap",
   "image": {
    "levels": [
     {
      "url": "media/panorama_8D3CFB4B_877A_6AF6_41CB_7F0920056CFD_0_HS_0_0_0_map.gif",
      "width": 32,
      "class": "ImageResourceLevel",
      "height": 16
     }
    ],
    "class": "ImageResource"
   },
   "pitch": -29.05
  }
 ],
 "class": "HotspotPanoramaOverlay",
 "areas": [
  {
   "click": "this.startPanoramaWithCamera(this.panorama_8D1FC4A9_8746_1FB2_4199_50FEC28B1F42, this.camera_84793707_8AC4_B3C8_41E1_2090479A1CFB); this.mainPlayList.set('selectedIndex', 15)",
   "class": "HotspotPanoramaOverlayArea",
   "mapColor": "#FF0000"
  }
 ],
 "rollOverDisplay": false,
 "enabledInCardboard": true,
 "items": [
  {
   "image": "this.AnimatedImageResource_81FBD739_8A44_B23B_41A6_0603FC1CF299",
   "pitch": -29.05,
   "hfov": 30.28,
   "class": "HotspotPanoramaOverlayImage",
   "distance": 100,
   "yaw": -147.14
  }
 ],
 "id": "overlay_897C7EB3_87C6_6B96_41DE_427A34916BB3",
 "data": {
  "label": "Arrow 03a"
 }
},
{
 "useHandCursor": true,
 "maps": [
  {
   "hfov": 28.87,
   "yaw": 111.41,
   "class": "HotspotPanoramaOverlayMap",
   "image": {
    "levels": [
     {
      "url": "media/panorama_8D3CFB4B_877A_6AF6_41CB_7F0920056CFD_0_HS_1_0_0_map.gif",
      "width": 32,
      "class": "ImageResourceLevel",
      "height": 16
     }
    ],
    "class": "ImageResource"
   },
   "pitch": -33.55
  }
 ],
 "class": "HotspotPanoramaOverlay",
 "areas": [
  {
   "click": "this.startPanoramaWithCamera(this.panorama_8D277116_877E_F69E_41DF_02AF33F8B702, this.camera_8442171B_8AC4_B3F8_41D0_94A4C83FEA10); this.mainPlayList.set('selectedIndex', 13)",
   "class": "HotspotPanoramaOverlayArea",
   "mapColor": "#FF0000"
  }
 ],
 "rollOverDisplay": false,
 "enabledInCardboard": true,
 "items": [
  {
   "image": "this.AnimatedImageResource_81FB7739_8A44_B23B_4194_674638BE2A49",
   "pitch": -33.55,
   "hfov": 28.87,
   "class": "HotspotPanoramaOverlayImage",
   "distance": 100,
   "yaw": 111.41
  }
 ],
 "id": "overlay_88B62037_87C6_169D_41D6_A95E677E3698",
 "data": {
  "label": "Arrow 03a"
 }
},
{
 "inertia": false,
 "id": "panorama_8D26FEDC_874A_2B92_41BD_9E25154EBA39_tcap0",
 "angle": 0,
 "distance": 50,
 "rotate": false,
 "hfov": 34.5,
 "class": "TripodCapPanoramaOverlay",
 "image": {
  "levels": [
   {
    "url": "media/panorama_8C698C0B_873E_2E76_41D9_D763A36BC981_tcap0.png",
    "width": 850,
    "class": "ImageResourceLevel",
    "height": 850
   }
  ],
  "class": "ImageResource"
 }
},
{
 "useHandCursor": true,
 "maps": [
  {
   "hfov": 30.52,
   "yaw": 1.36,
   "class": "HotspotPanoramaOverlayMap",
   "image": {
    "levels": [
     {
      "url": "media/panorama_8D26FEDC_874A_2B92_41BD_9E25154EBA39_0_HS_0_0_0_map.gif",
      "width": 32,
      "class": "ImageResourceLevel",
      "height": 16
     }
    ],
    "class": "ImageResource"
   },
   "pitch": -28.23
  }
 ],
 "class": "HotspotPanoramaOverlay",
 "areas": [
  {
   "click": "this.mainPlayList.set('selectedIndex', 11)",
   "class": "HotspotPanoramaOverlayArea",
   "mapColor": "#FF0000"
  }
 ],
 "rollOverDisplay": false,
 "enabledInCardboard": true,
 "items": [
  {
   "image": "this.AnimatedImageResource_81F83737_8A44_B237_41DC_F808112CC6CE",
   "pitch": -28.23,
   "hfov": 30.52,
   "class": "HotspotPanoramaOverlayImage",
   "distance": 100,
   "yaw": 1.36
  }
 ],
 "id": "overlay_8982942E_873A_7E8E_41D0_7F0625FD2EA0",
 "data": {
  "label": "Arrow 03a"
 }
},
{
 "useHandCursor": true,
 "maps": [
  {
   "hfov": 26.34,
   "yaw": -96,
   "class": "HotspotPanoramaOverlayMap",
   "image": {
    "levels": [
     {
      "url": "media/panorama_8D26FEDC_874A_2B92_41BD_9E25154EBA39_0_HS_1_0_0_map.gif",
      "width": 32,
      "class": "ImageResourceLevel",
      "height": 16
     }
    ],
    "class": "ImageResource"
   },
   "pitch": -40.5
  }
 ],
 "class": "HotspotPanoramaOverlay",
 "areas": [
  {
   "click": "this.startPanoramaWithCamera(this.panorama_8D23D510_8746_1E92_41AA_543AD4625D58, this.camera_845F4748_8AC4_B259_41CF_26C1BA22026D); this.mainPlayList.set('selectedIndex', 1)",
   "class": "HotspotPanoramaOverlayArea",
   "mapColor": "#FF0000"
  }
 ],
 "rollOverDisplay": false,
 "enabledInCardboard": true,
 "items": [
  {
   "image": "this.AnimatedImageResource_81F9E737_8A44_B237_41D6_D11211AC5500",
   "pitch": -40.5,
   "hfov": 26.34,
   "class": "HotspotPanoramaOverlayImage",
   "distance": 100,
   "yaw": -96
  }
 ],
 "id": "overlay_88450E43_873A_2AF6_41DD_58EA30552B4E",
 "data": {
  "label": "Arrow 03a"
 }
},
{
 "useHandCursor": true,
 "maps": [
  {
   "hfov": 29.4,
   "yaw": 98.73,
   "class": "HotspotPanoramaOverlayMap",
   "image": {
    "levels": [
     {
      "url": "media/panorama_8D26FEDC_874A_2B92_41BD_9E25154EBA39_0_HS_2_0_0_map.gif",
      "width": 32,
      "class": "ImageResourceLevel",
      "height": 16
     }
    ],
    "class": "ImageResource"
   },
   "pitch": -31.91
  }
 ],
 "class": "HotspotPanoramaOverlay",
 "areas": [
  {
   "click": "this.startPanoramaWithCamera(this.panorama_8D3214D1_874A_3F92_41B8_DE3A41B87CDE, this.camera_844A672B_8AC4_B3DF_41AF_530DB9F3B14A); this.mainPlayList.set('selectedIndex', 9)",
   "class": "HotspotPanoramaOverlayArea",
   "mapColor": "#FF0000"
  }
 ],
 "rollOverDisplay": false,
 "enabledInCardboard": true,
 "items": [
  {
   "image": "this.AnimatedImageResource_81F9B737_8A44_B237_41D0_D163DAE0A751",
   "pitch": -31.91,
   "hfov": 29.4,
   "class": "HotspotPanoramaOverlayImage",
   "distance": 100,
   "yaw": 98.73
  }
 ],
 "id": "overlay_88085E60_873A_2AB2_41D4_14E4FF7BFFD2",
 "data": {
  "label": "Arrow 03a"
 }
},
{
 "inertia": false,
 "id": "panorama_8D1FC4A9_8746_1FB2_4199_50FEC28B1F42_tcap0",
 "angle": 0,
 "distance": 50,
 "rotate": false,
 "hfov": 34.5,
 "class": "TripodCapPanoramaOverlay",
 "image": {
  "levels": [
   {
    "url": "media/panorama_8C698C0B_873E_2E76_41D9_D763A36BC981_tcap0.png",
    "width": 850,
    "class": "ImageResourceLevel",
    "height": 850
   }
  ],
  "class": "ImageResource"
 }
},
{
 "useHandCursor": true,
 "maps": [
  {
   "hfov": 30.86,
   "yaw": 91.36,
   "class": "HotspotPanoramaOverlayMap",
   "image": {
    "levels": [
     {
      "url": "media/panorama_8D1FC4A9_8746_1FB2_4199_50FEC28B1F42_0_HS_0_0_0_map.gif",
      "width": 32,
      "class": "ImageResourceLevel",
      "height": 16
     }
    ],
    "class": "ImageResource"
   },
   "pitch": -27
  }
 ],
 "class": "HotspotPanoramaOverlay",
 "areas": [
  {
   "click": "this.startPanoramaWithCamera(this.panorama_8D3CFB4B_877A_6AF6_41CB_7F0920056CFD, this.camera_8581148C_8AC4_B6D9_41C9_50CCC4198134); this.mainPlayList.set('selectedIndex', 14)",
   "class": "HotspotPanoramaOverlayArea",
   "mapColor": "#FF0000"
  }
 ],
 "rollOverDisplay": false,
 "enabledInCardboard": true,
 "items": [
  {
   "image": "this.AnimatedImageResource_81FB173A_8A44_B239_41CE_DEFE9288C6A2",
   "pitch": -27,
   "hfov": 30.86,
   "class": "HotspotPanoramaOverlayImage",
   "distance": 100,
   "yaw": 91.36
  }
 ],
 "id": "overlay_88850B15_87CA_2A92_41CB_EC1E5FF7A08D",
 "data": {
  "label": "Arrow 03a"
 }
},
{
 "useHandCursor": true,
 "maps": [
  {
   "hfov": 28.73,
   "yaw": -98.45,
   "class": "HotspotPanoramaOverlayMap",
   "image": {
    "levels": [
     {
      "url": "media/panorama_8D1FC4A9_8746_1FB2_4199_50FEC28B1F42_0_HS_1_0_0_map.gif",
      "width": 32,
      "class": "ImageResourceLevel",
      "height": 16
     }
    ],
    "class": "ImageResource"
   },
   "pitch": -33.95
  }
 ],
 "class": "HotspotPanoramaOverlay",
 "areas": [
  {
   "click": "this.mainPlayList.set('selectedIndex', 16)",
   "class": "HotspotPanoramaOverlayArea",
   "mapColor": "#FF0000"
  }
 ],
 "rollOverDisplay": false,
 "enabledInCardboard": true,
 "items": [
  {
   "image": "this.AnimatedImageResource_81F4B73A_8A44_B239_41CE_43C4BF0EC835",
   "pitch": -33.95,
   "hfov": 28.73,
   "class": "HotspotPanoramaOverlayImage",
   "distance": 100,
   "yaw": -98.45
  }
 ],
 "id": "overlay_88BDDCA2_87CA_EFB7_4197_A38A448B5668",
 "data": {
  "label": "Arrow 03a"
 }
},
{
 "inertia": false,
 "id": "panorama_8C698C0B_873E_2E76_41D9_D763A36BC981_tcap0",
 "angle": 0,
 "distance": 50,
 "rotate": false,
 "hfov": 34.5,
 "class": "TripodCapPanoramaOverlay",
 "image": {
  "levels": [
   {
    "url": "media/panorama_8C698C0B_873E_2E76_41D9_D763A36BC981_tcap0.png",
    "width": 850,
    "class": "ImageResourceLevel",
    "height": 850
   }
  ],
  "class": "ImageResource"
 }
},
{
 "useHandCursor": true,
 "maps": [
  {
   "hfov": 28.87,
   "yaw": 2.59,
   "class": "HotspotPanoramaOverlayMap",
   "image": {
    "levels": [
     {
      "url": "media/panorama_8C698C0B_873E_2E76_41D9_D763A36BC981_0_HS_0_0_0_map.gif",
      "width": 32,
      "class": "ImageResourceLevel",
      "height": 16
     }
    ],
    "class": "ImageResource"
   },
   "pitch": -33.55
  }
 ],
 "class": "HotspotPanoramaOverlay",
 "areas": [
  {
   "click": "this.startPanoramaWithCamera(this.panorama_8D23D510_8746_1E92_41AA_543AD4625D58, this.camera_85406612_8AC4_B5C8_41C1_E7DEA36F7498); this.mainPlayList.set('selectedIndex', 1)",
   "class": "HotspotPanoramaOverlayArea",
   "mapColor": "#FF0000"
  }
 ],
 "rollOverDisplay": false,
 "enabledInCardboard": true,
 "items": [
  {
   "image": "this.AnimatedImageResource_81FCE72D_8A44_B3DB_41D1_F8ACF9BB223C",
   "pitch": -33.55,
   "hfov": 28.87,
   "class": "HotspotPanoramaOverlayImage",
   "distance": 100,
   "yaw": 2.59
  }
 ],
 "id": "overlay_887C3082_873E_F677_41C5_D151B2BCA94A",
 "data": {
  "label": "Arrow 03a"
 }
},
{
 "inertia": false,
 "id": "panorama_8D349E28_875A_2AB3_4191_8B7C205E4B8B_tcap0",
 "angle": 0,
 "distance": 50,
 "rotate": false,
 "hfov": 34.5,
 "class": "TripodCapPanoramaOverlay",
 "image": {
  "levels": [
   {
    "url": "media/panorama_8C698C0B_873E_2E76_41D9_D763A36BC981_tcap0.png",
    "width": 850,
    "class": "ImageResourceLevel",
    "height": 850
   }
  ],
  "class": "ImageResource"
 }
},
{
 "useHandCursor": true,
 "maps": [
  {
   "hfov": 31.9,
   "yaw": 86.05,
   "class": "HotspotPanoramaOverlayMap",
   "image": {
    "levels": [
     {
      "url": "media/panorama_8D349E28_875A_2AB3_4191_8B7C205E4B8B_0_HS_0_0_0_map.gif",
      "width": 32,
      "class": "ImageResourceLevel",
      "height": 16
     }
    ],
    "class": "ImageResource"
   },
   "pitch": -22.91
  }
 ],
 "class": "HotspotPanoramaOverlay",
 "areas": [
  {
   "click": "this.startPanoramaWithCamera(this.panorama_8D265541_874A_FEF2_41DE_A0BC495C5419, this.camera_857005FF_8AC4_B637_41D5_5E4EA1E6D842); this.mainPlayList.set('selectedIndex', 4)",
   "class": "HotspotPanoramaOverlayArea",
   "mapColor": "#FF0000"
  }
 ],
 "rollOverDisplay": false,
 "enabledInCardboard": true,
 "items": [
  {
   "image": "this.AnimatedImageResource_81FFF732_8A44_B3C9_41BD_64F9EF7D6725",
   "pitch": -22.91,
   "hfov": 31.9,
   "class": "HotspotPanoramaOverlayImage",
   "distance": 100,
   "yaw": 86.05
  }
 ],
 "id": "overlay_898AB4C3_873E_7FF6_41A1_1875BC19E479",
 "data": {
  "label": "Arrow 03a"
 }
},
{
 "useHandCursor": true,
 "maps": [
  {
   "hfov": 27.58,
   "yaw": -95.59,
   "class": "HotspotPanoramaOverlayMap",
   "image": {
    "levels": [
     {
      "url": "media/panorama_8D349E28_875A_2AB3_4191_8B7C205E4B8B_0_HS_1_0_0_map.gif",
      "width": 32,
      "class": "ImageResourceLevel",
      "height": 16
     }
    ],
    "class": "ImageResource"
   },
   "pitch": -37.23
  }
 ],
 "class": "HotspotPanoramaOverlay",
 "areas": [
  {
   "click": "this.startPanoramaWithCamera(this.panorama_8D2AB845_875A_36FD_41C5_7712FAF92241, this.camera_851DD5C5_8AC4_B648_41BC_9E0D063FDF7A); this.mainPlayList.set('selectedIndex', 6)",
   "class": "HotspotPanoramaOverlayArea",
   "mapColor": "#FF0000"
  }
 ],
 "rollOverDisplay": false,
 "enabledInCardboard": true,
 "items": [
  {
   "image": "this.AnimatedImageResource_81FFC732_8A44_B3C9_41AC_CFC18D524862",
   "pitch": -37.23,
   "hfov": 27.58,
   "class": "HotspotPanoramaOverlayImage",
   "distance": 100,
   "yaw": -95.59
  }
 ],
 "id": "overlay_884B692B_873E_16B6_41DE_FE551AFAAFB5",
 "data": {
  "label": "Arrow 03a"
 }
},
{
 "useHandCursor": true,
 "maps": [
  {
   "hfov": 26.81,
   "yaw": 170.73,
   "class": "HotspotPanoramaOverlayMap",
   "image": {
    "levels": [
     {
      "url": "media/panorama_8D349E28_875A_2AB3_4191_8B7C205E4B8B_0_HS_2_0_0_map.gif",
      "width": 32,
      "class": "ImageResourceLevel",
      "height": 16
     }
    ],
    "class": "ImageResource"
   },
   "pitch": -39.27
  }
 ],
 "class": "HotspotPanoramaOverlay",
 "areas": [
  {
   "click": "this.startPanoramaWithCamera(this.panorama_8D342236_875E_1A9E_41D1_D2B4A3232FA4, this.camera_856FC5ED_8AC4_B658_41DD_34D663F3898C); this.mainPlayList.set('selectedIndex', 7)",
   "class": "HotspotPanoramaOverlayArea",
   "mapColor": "#FF0000"
  }
 ],
 "rollOverDisplay": false,
 "enabledInCardboard": true,
 "items": [
  {
   "image": "this.AnimatedImageResource_81FF7733_8A44_B3CF_41E0_6C8BD9D17F18",
   "pitch": -39.27,
   "hfov": 26.81,
   "class": "HotspotPanoramaOverlayImage",
   "distance": 100,
   "yaw": 170.73
  }
 ],
 "id": "overlay_88F717A4_873E_19B2_41CD_19077D661A00",
 "data": {
  "label": "Arrow 03a"
 }
},
{
 "inertia": false,
 "id": "panorama_8D21215C_8746_3692_4179_F0E8FC89F914_tcap0",
 "angle": 0,
 "distance": 50,
 "rotate": false,
 "hfov": 34.5,
 "class": "TripodCapPanoramaOverlay",
 "image": {
  "levels": [
   {
    "url": "media/panorama_8C698C0B_873E_2E76_41D9_D763A36BC981_tcap0.png",
    "width": 850,
    "class": "ImageResourceLevel",
    "height": 850
   }
  ],
  "class": "ImageResource"
 }
},
{
 "useHandCursor": true,
 "maps": [
  {
   "hfov": 33.68,
   "yaw": 169.5,
   "class": "HotspotPanoramaOverlayMap",
   "image": {
    "levels": [
     {
      "url": "media/panorama_8D21215C_8746_3692_4179_F0E8FC89F914_0_HS_0_0_0_map.gif",
      "width": 32,
      "class": "ImageResourceLevel",
      "height": 16
     }
    ],
    "class": "ImageResource"
   },
   "pitch": -13.5
  }
 ],
 "class": "HotspotPanoramaOverlay",
 "areas": [
  {
   "click": "this.startPanoramaWithCamera(this.panorama_8D26FEDC_874A_2B92_41BD_9E25154EBA39, this.camera_859484A0_8AC4_B6C8_41E0_350D6EFFC644); this.mainPlayList.set('selectedIndex', 10)",
   "class": "HotspotPanoramaOverlayArea",
   "mapColor": "#FF0000"
  }
 ],
 "rollOverDisplay": false,
 "enabledInCardboard": true,
 "items": [
  {
   "image": "this.AnimatedImageResource_81F96738_8A44_B239_41CE_4EAFE7AFA793",
   "pitch": -13.5,
   "hfov": 33.68,
   "class": "HotspotPanoramaOverlayImage",
   "distance": 100,
   "yaw": 169.5
  }
 ],
 "id": "overlay_8980E716_873A_1A9E_41D1_DF0FDB83C9C5",
 "data": {
  "label": "Arrow 03a"
 }
},
{
 "inertia": false,
 "id": "panorama_8D3FB7D2_877A_1996_41D4_7689BB9D7D11_tcap0",
 "angle": 0,
 "distance": 50,
 "rotate": false,
 "hfov": 34.5,
 "class": "TripodCapPanoramaOverlay",
 "image": {
  "levels": [
   {
    "url": "media/panorama_8C698C0B_873E_2E76_41D9_D763A36BC981_tcap0.png",
    "width": 850,
    "class": "ImageResourceLevel",
    "height": 850
   }
  ],
  "class": "ImageResource"
 }
},
{
 "useHandCursor": true,
 "maps": [
  {
   "hfov": 28.17,
   "yaw": -98.86,
   "class": "HotspotPanoramaOverlayMap",
   "image": {
    "levels": [
     {
      "url": "media/panorama_8D3FB7D2_877A_1996_41D4_7689BB9D7D11_0_HS_0_0_0_map.gif",
      "width": 32,
      "class": "ImageResourceLevel",
      "height": 16
     }
    ],
    "class": "ImageResource"
   },
   "pitch": -35.59
  }
 ],
 "class": "HotspotPanoramaOverlay",
 "areas": [
  {
   "click": "this.mainPlayList.set('selectedIndex', 13)",
   "class": "HotspotPanoramaOverlayArea",
   "mapColor": "#FF0000"
  }
 ],
 "rollOverDisplay": false,
 "enabledInCardboard": true,
 "items": [
  {
   "image": "this.AnimatedImageResource_81FAF738_8A44_B239_41D1_64FA68726C6A",
   "pitch": -35.59,
   "hfov": 28.17,
   "class": "HotspotPanoramaOverlayImage",
   "distance": 100,
   "yaw": -98.86
  }
 ],
 "id": "overlay_898AD3B6_873A_199E_41D1_8C930F94CF45",
 "data": {
  "label": "Arrow 03a"
 }
},
{
 "useHandCursor": true,
 "maps": [
  {
   "hfov": 28.31,
   "yaw": 85.64,
   "class": "HotspotPanoramaOverlayMap",
   "image": {
    "levels": [
     {
      "url": "media/panorama_8D3FB7D2_877A_1996_41D4_7689BB9D7D11_0_HS_1_0_0_map.gif",
      "width": 32,
      "class": "ImageResourceLevel",
      "height": 16
     }
    ],
    "class": "ImageResource"
   },
   "pitch": -35.18
  }
 ],
 "class": "HotspotPanoramaOverlay",
 "areas": [
  {
   "click": "this.startPanoramaWithCamera(this.panorama_8D3214D1_874A_3F92_41B8_DE3A41B87CDE, this.camera_846A76C7_8AC4_B257_41D8_F6FFCFEB93FF); this.mainPlayList.set('selectedIndex', 9)",
   "class": "HotspotPanoramaOverlayArea",
   "mapColor": "#FF0000"
  }
 ],
 "rollOverDisplay": false,
 "enabledInCardboard": true,
 "items": [
  {
   "image": "this.AnimatedImageResource_81FAB738_8A44_B239_41E0_D5DA8B49B680",
   "pitch": -35.18,
   "hfov": 28.31,
   "class": "HotspotPanoramaOverlayImage",
   "distance": 100,
   "yaw": 85.64
  }
 ],
 "id": "overlay_884FD46F_873A_3E8E_41DE_76BEB63330B1",
 "data": {
  "label": "Arrow 03a"
 }
},
{
 "inertia": false,
 "id": "panorama_8D2AB845_875A_36FD_41C5_7712FAF92241_tcap0",
 "angle": 0,
 "distance": 50,
 "rotate": false,
 "hfov": 34.5,
 "class": "TripodCapPanoramaOverlay",
 "image": {
  "levels": [
   {
    "url": "media/panorama_8C698C0B_873E_2E76_41D9_D763A36BC981_tcap0.png",
    "width": 850,
    "class": "ImageResourceLevel",
    "height": 850
   }
  ],
  "class": "ImageResource"
 }
},
{
 "useHandCursor": true,
 "maps": [
  {
   "hfov": 31.08,
   "yaw": 91.36,
   "class": "HotspotPanoramaOverlayMap",
   "image": {
    "levels": [
     {
      "url": "media/panorama_8D2AB845_875A_36FD_41C5_7712FAF92241_0_HS_0_0_0_map.gif",
      "width": 32,
      "class": "ImageResourceLevel",
      "height": 16
     }
    ],
    "class": "ImageResource"
   },
   "pitch": -26.18
  }
 ],
 "class": "HotspotPanoramaOverlay",
 "areas": [
  {
   "click": "this.startPanoramaWithCamera(this.panorama_8D349E28_875A_2AB3_4191_8B7C205E4B8B, this.camera_847E26EE_8AC4_B258_41CC_352D8BFFE83C); this.mainPlayList.set('selectedIndex', 5)",
   "class": "HotspotPanoramaOverlayArea",
   "mapColor": "#FF0000"
  }
 ],
 "rollOverDisplay": false,
 "enabledInCardboard": true,
 "items": [
  {
   "image": "this.AnimatedImageResource_81FEB734_8A44_B3C9_41B5_438D8C422B36",
   "pitch": -26.18,
   "hfov": 31.08,
   "class": "HotspotPanoramaOverlayImage",
   "distance": 100,
   "yaw": 91.36
  }
 ],
 "id": "overlay_898E7BC5_873A_29FD_41D1_E5C1F799F17B",
 "data": {
  "label": "Arrow 03a"
 }
},
{
 "useHandCursor": true,
 "maps": [
  {
   "hfov": 27.73,
   "yaw": -163.91,
   "class": "HotspotPanoramaOverlayMap",
   "image": {
    "levels": [
     {
      "url": "media/panorama_8D2AB845_875A_36FD_41C5_7712FAF92241_0_HS_1_0_0_map.gif",
      "width": 32,
      "class": "ImageResourceLevel",
      "height": 16
     }
    ],
    "class": "ImageResource"
   },
   "pitch": -36.82
  }
 ],
 "class": "HotspotPanoramaOverlay",
 "areas": [
  {
   "click": "this.startPanoramaWithCamera(this.panorama_8D342236_875E_1A9E_41D1_D2B4A3232FA4, this.camera_847456DA_8AC4_B278_41DB_2C00BD462215); this.mainPlayList.set('selectedIndex', 7)",
   "class": "HotspotPanoramaOverlayArea",
   "mapColor": "#FF0000"
  }
 ],
 "rollOverDisplay": false,
 "enabledInCardboard": true,
 "items": [
  {
   "image": "this.AnimatedImageResource_81FE8734_8A44_B3C9_41CB_43D2A075CA7B",
   "pitch": -36.82,
   "hfov": 27.73,
   "class": "HotspotPanoramaOverlayImage",
   "distance": 100,
   "yaw": -163.91
  }
 ],
 "id": "overlay_883A5940_873A_16F2_41D8_9E9DE41C8DFB",
 "data": {
  "label": "Arrow 03a"
 }
},
{
 "inertia": false,
 "id": "panorama_8D3214D1_874A_3F92_41B8_DE3A41B87CDE_tcap0",
 "angle": 0,
 "distance": 50,
 "rotate": false,
 "hfov": 34.5,
 "class": "TripodCapPanoramaOverlay",
 "image": {
  "levels": [
   {
    "url": "media/panorama_8C698C0B_873E_2E76_41D9_D763A36BC981_tcap0.png",
    "width": 850,
    "class": "ImageResourceLevel",
    "height": 850
   }
  ],
  "class": "ImageResource"
 }
},
{
 "useHandCursor": true,
 "maps": [
  {
   "hfov": 29.14,
   "yaw": 6.27,
   "class": "HotspotPanoramaOverlayMap",
   "image": {
    "levels": [
     {
      "url": "media/panorama_8D3214D1_874A_3F92_41B8_DE3A41B87CDE_0_HS_0_0_0_map.gif",
      "width": 32,
      "class": "ImageResourceLevel",
      "height": 16
     }
    ],
    "class": "ImageResource"
   },
   "pitch": -32.73
  }
 ],
 "class": "HotspotPanoramaOverlay",
 "areas": [
  {
   "click": "this.startPanoramaWithCamera(this.panorama_8D012E2E_874A_2A8E_4191_30904C062B4B, this.camera_9AA2563A_8AC4_B238_41D2_2DC57C9425BC); this.mainPlayList.set('selectedIndex', 16)",
   "class": "HotspotPanoramaOverlayArea",
   "mapColor": "#FF0000"
  }
 ],
 "rollOverDisplay": false,
 "enabledInCardboard": true,
 "items": [
  {
   "image": "this.AnimatedImageResource_81F8F736_8A44_B3C9_41CC_75F090F4A264",
   "pitch": -32.73,
   "hfov": 29.14,
   "class": "HotspotPanoramaOverlayImage",
   "distance": 100,
   "yaw": 6.27
  }
 ],
 "id": "overlay_8989F8F5_873A_1792_41D7_AFB72BACFE62",
 "data": {
  "label": "Arrow 03a"
 }
},
{
 "useHandCursor": true,
 "maps": [
  {
   "hfov": 30.86,
   "yaw": -96,
   "class": "HotspotPanoramaOverlayMap",
   "image": {
    "levels": [
     {
      "url": "media/panorama_8D3214D1_874A_3F92_41B8_DE3A41B87CDE_0_HS_1_0_0_map.gif",
      "width": 32,
      "class": "ImageResourceLevel",
      "height": 16
     }
    ],
    "class": "ImageResource"
   },
   "pitch": -27
  }
 ],
 "class": "HotspotPanoramaOverlay",
 "areas": [
  {
   "click": "this.startPanoramaWithCamera(this.panorama_8D26FEDC_874A_2B92_41BD_9E25154EBA39, this.camera_85525626_8AC4_B5C8_41D6_8780B5FC2491); this.mainPlayList.set('selectedIndex', 10)",
   "class": "HotspotPanoramaOverlayArea",
   "mapColor": "#FF0000"
  }
 ],
 "rollOverDisplay": false,
 "enabledInCardboard": true,
 "items": [
  {
   "image": "this.AnimatedImageResource_81F8C736_8A44_B3C9_4195_6B01318E0587",
   "pitch": -27,
   "hfov": 30.86,
   "class": "HotspotPanoramaOverlayImage",
   "distance": 100,
   "yaw": -96
  }
 ],
 "id": "overlay_88308247_873B_FAFE_41E0_83A746A3CA0A",
 "data": {
  "label": "Arrow 03a"
 }
},
{
 "useHandCursor": true,
 "maps": [
  {
   "hfov": 32.09,
   "yaw": 87.68,
   "class": "HotspotPanoramaOverlayMap",
   "image": {
    "levels": [
     {
      "url": "media/panorama_8D3214D1_874A_3F92_41B8_DE3A41B87CDE_0_HS_2_0_0_map.gif",
      "width": 32,
      "class": "ImageResourceLevel",
      "height": 16
     }
    ],
    "class": "ImageResource"
   },
   "pitch": -22.09
  }
 ],
 "class": "HotspotPanoramaOverlay",
 "areas": [
  {
   "click": "this.startPanoramaWithCamera(this.panorama_8D3FB7D2_877A_1996_41D4_7689BB9D7D11, this.camera_9AB4564E_8AC4_B258_41D2_09CBA9E7921C); this.mainPlayList.set('selectedIndex', 12)",
   "class": "HotspotPanoramaOverlayArea",
   "mapColor": "#FF0000"
  }
 ],
 "rollOverDisplay": false,
 "enabledInCardboard": true,
 "items": [
  {
   "image": "this.AnimatedImageResource_81F88736_8A44_B3C9_41D3_8353B127C18D",
   "pitch": -22.09,
   "hfov": 32.09,
   "class": "HotspotPanoramaOverlayImage",
   "distance": 100,
   "yaw": 87.68
  }
 ],
 "id": "overlay_88E579F5_873A_2992_41D2_7839F5DBE953",
 "data": {
  "label": "Arrow 03a"
 }
},
{
 "inertia": false,
 "id": "panorama_8D26F0D5_874A_1792_41C4_D544048ED703_tcap0",
 "angle": 0,
 "distance": 50,
 "rotate": false,
 "hfov": 34.5,
 "class": "TripodCapPanoramaOverlay",
 "image": {
  "levels": [
   {
    "url": "media/panorama_8C698C0B_873E_2E76_41D9_D763A36BC981_tcap0.png",
    "width": 850,
    "class": "ImageResourceLevel",
    "height": 850
   }
  ],
  "class": "ImageResource"
 }
},
{
 "useHandCursor": true,
 "maps": [
  {
   "hfov": 26.81,
   "yaw": 105.27,
   "class": "HotspotPanoramaOverlayMap",
   "image": {
    "levels": [
     {
      "url": "media/panorama_8D26F0D5_874A_1792_41C4_D544048ED703_0_HS_0_0_0_map.gif",
      "width": 32,
      "class": "ImageResourceLevel",
      "height": 16
     }
    ],
    "class": "ImageResource"
   },
   "pitch": -39.27
  }
 ],
 "class": "HotspotPanoramaOverlay",
 "areas": [
  {
   "click": "this.startPanoramaWithCamera(this.panorama_8D23D510_8746_1E92_41AA_543AD4625D58, this.camera_846F46B2_8AC4_B2C8_41BE_474F8FB78CFE); this.mainPlayList.set('selectedIndex', 1)",
   "class": "HotspotPanoramaOverlayArea",
   "mapColor": "#FF0000"
  }
 ],
 "rollOverDisplay": false,
 "enabledInCardboard": true,
 "items": [
  {
   "image": "this.AnimatedImageResource_81FDB730_8A44_B3C9_41C2_483137EF39F6",
   "pitch": -39.27,
   "hfov": 26.81,
   "class": "HotspotPanoramaOverlayImage",
   "distance": 100,
   "yaw": 105.27
  }
 ],
 "id": "overlay_8887D315_873E_1A9D_41E0_C97988501BE8",
 "data": {
  "label": "Arrow 03a"
 }
},
{
 "useHandCursor": true,
 "maps": [
  {
   "hfov": 26.18,
   "yaw": -69,
   "class": "HotspotPanoramaOverlayMap",
   "image": {
    "levels": [
     {
      "url": "media/panorama_8D26F0D5_874A_1792_41C4_D544048ED703_0_HS_1_0_0_map.gif",
      "width": 32,
      "class": "ImageResourceLevel",
      "height": 16
     }
    ],
    "class": "ImageResource"
   },
   "pitch": -40.91
  }
 ],
 "class": "HotspotPanoramaOverlay",
 "areas": [
  {
   "click": "this.startPanoramaWithCamera(this.panorama_8D330B1E_874E_6A8E_41D2_0A89F6F28F55, this.camera_8464D69E_8AC4_B2F8_41D3_02CA7ECBDEE3); this.mainPlayList.set('selectedIndex', 3)",
   "class": "HotspotPanoramaOverlayArea",
   "mapColor": "#FF0000"
  }
 ],
 "rollOverDisplay": false,
 "enabledInCardboard": true,
 "items": [
  {
   "image": "this.AnimatedImageResource_81FD9730_8A44_B3C9_41D4_12FA084D5691",
   "pitch": -40.91,
   "hfov": 26.18,
   "class": "HotspotPanoramaOverlayImage",
   "distance": 100,
   "yaw": -69
  }
 ],
 "id": "overlay_883BD93D_873E_3692_41DD_BF676C27100C",
 "data": {
  "label": "Arrow 03a"
 }
},
{
 "useHandCursor": true,
 "maps": [
  {
   "hfov": 30.75,
   "yaw": -173.32,
   "class": "HotspotPanoramaOverlayMap",
   "image": {
    "levels": [
     {
      "url": "media/panorama_8D26F0D5_874A_1792_41C4_D544048ED703_0_HS_2_0_0_map.gif",
      "width": 32,
      "class": "ImageResourceLevel",
      "height": 16
     }
    ],
    "class": "ImageResource"
   },
   "pitch": -27.41
  }
 ],
 "class": "HotspotPanoramaOverlay",
 "areas": [
  {
   "click": "this.startPanoramaWithCamera(this.panorama_8D2E44C5_875A_FFF2_41D2_998B2388C555, this.camera_9A847662_8AC4_B248_41DF_D07E4C9371F7); this.mainPlayList.set('selectedIndex', 8)",
   "class": "HotspotPanoramaOverlayArea",
   "mapColor": "#FF0000"
  }
 ],
 "rollOverDisplay": false,
 "enabledInCardboard": true,
 "items": [
  {
   "image": "this.AnimatedImageResource_81FD5730_8A44_B3C9_41DE_9225D04E93A1",
   "pitch": -27.41,
   "hfov": 30.75,
   "class": "HotspotPanoramaOverlayImage",
   "distance": 100,
   "yaw": -173.32
  }
 ],
 "id": "overlay_88E987BD_873E_7992_41D5_0E4DAA72685F",
 "data": {
  "label": "Arrow 03a"
 }
},
{
 "inertia": false,
 "id": "panorama_8D23D510_8746_1E92_41AA_543AD4625D58_tcap0",
 "angle": 0,
 "distance": 50,
 "rotate": false,
 "hfov": 34.5,
 "class": "TripodCapPanoramaOverlay",
 "image": {
  "levels": [
   {
    "url": "media/panorama_8C698C0B_873E_2E76_41D9_D763A36BC981_tcap0.png",
    "width": 850,
    "class": "ImageResourceLevel",
    "height": 850
   }
  ],
  "class": "ImageResource"
 }
},
{
 "useHandCursor": true,
 "maps": [
  {
   "hfov": 28.87,
   "yaw": -18.68,
   "class": "HotspotPanoramaOverlayMap",
   "image": {
    "levels": [
     {
      "url": "media/panorama_8D23D510_8746_1E92_41AA_543AD4625D58_0_HS_0_0_0_map.gif",
      "width": 32,
      "class": "ImageResourceLevel",
      "height": 16
     }
    ],
    "class": "ImageResource"
   },
   "pitch": -33.55
  }
 ],
 "class": "HotspotPanoramaOverlay",
 "areas": [
  {
   "click": "this.startPanoramaWithCamera(this.panorama_8D26FEDC_874A_2B92_41BD_9E25154EBA39, this.camera_85E624AF_8AC4_B6D7_41DC_0E72F7359297); this.mainPlayList.set('selectedIndex', 10)",
   "class": "HotspotPanoramaOverlayArea",
   "mapColor": "#FF0000"
  }
 ],
 "rollOverDisplay": false,
 "enabledInCardboard": true,
 "items": [
  {
   "image": "this.AnimatedImageResource_81FC672F_8A44_B3D7_41CC_85131EE4287D",
   "pitch": -33.55,
   "hfov": 28.87,
   "class": "HotspotPanoramaOverlayImage",
   "distance": 100,
   "yaw": -18.68
  }
 ],
 "id": "overlay_8853E136_873E_169E_41D1_9DEAB7DB5E91",
 "data": {
  "label": "Arrow 03a"
 }
},
{
 "useHandCursor": true,
 "maps": [
  {
   "hfov": 29.79,
   "yaw": 74.18,
   "class": "HotspotPanoramaOverlayMap",
   "image": {
    "levels": [
     {
      "url": "media/panorama_8D23D510_8746_1E92_41AA_543AD4625D58_0_HS_1_0_0_map.gif",
      "width": 32,
      "class": "ImageResourceLevel",
      "height": 16
     }
    ],
    "class": "ImageResource"
   },
   "pitch": -30.68
  }
 ],
 "class": "HotspotPanoramaOverlay",
 "areas": [
  {
   "click": "this.startPanoramaWithCamera(this.panorama_8D26F0D5_874A_1792_41C4_D544048ED703, this.camera_85F694C0_8AC4_B648_419F_715322C5B34A); this.mainPlayList.set('selectedIndex', 2)",
   "class": "HotspotPanoramaOverlayArea",
   "mapColor": "#FF0000"
  }
 ],
 "rollOverDisplay": false,
 "enabledInCardboard": true,
 "items": [
  {
   "image": "this.AnimatedImageResource_81FC472F_8A44_B3D7_41D4_246250F79A33",
   "pitch": -30.68,
   "hfov": 29.79,
   "class": "HotspotPanoramaOverlayImage",
   "distance": 100,
   "yaw": 74.18
  }
 ],
 "id": "overlay_88175395_873E_7992_41D0_AE046DDF6EA2",
 "data": {
  "label": "Arrow 03a"
 }
},
{
 "useHandCursor": true,
 "maps": [
  {
   "hfov": 23.42,
   "yaw": -106.23,
   "class": "HotspotPanoramaOverlayMap",
   "image": {
    "levels": [
     {
      "url": "media/panorama_8D23D510_8746_1E92_41AA_543AD4625D58_0_HS_2_0_0_map.gif",
      "width": 32,
      "class": "ImageResourceLevel",
      "height": 16
     }
    ],
    "class": "ImageResource"
   },
   "pitch": -47.45
  }
 ],
 "class": "HotspotPanoramaOverlay",
 "areas": [
  {
   "click": "this.mainPlayList.set('selectedIndex', 0)",
   "class": "HotspotPanoramaOverlayArea",
   "mapColor": "#FF0000"
  }
 ],
 "rollOverDisplay": false,
 "enabledInCardboard": true,
 "items": [
  {
   "image": "this.AnimatedImageResource_81FC0730_8A44_B3C9_41C7_52F84C22AA7E",
   "pitch": -47.45,
   "hfov": 23.42,
   "class": "HotspotPanoramaOverlayImage",
   "distance": 100,
   "yaw": -106.23
  }
 ],
 "id": "overlay_899C4A66_873E_2ABE_4190_9E8D5AA5E623",
 "data": {
  "label": "Arrow 03a"
 }
},
{
 "inertia": false,
 "id": "panorama_8D330B1E_874E_6A8E_41D2_0A89F6F28F55_tcap0",
 "angle": 0,
 "distance": 50,
 "rotate": false,
 "hfov": 34.5,
 "class": "TripodCapPanoramaOverlay",
 "image": {
  "levels": [
   {
    "url": "media/panorama_8C698C0B_873E_2E76_41D9_D763A36BC981_tcap0.png",
    "width": 850,
    "class": "ImageResourceLevel",
    "height": 850
   }
  ],
  "class": "ImageResource"
 }
},
{
 "useHandCursor": true,
 "maps": [
  {
   "hfov": 27.88,
   "yaw": -148.36,
   "class": "HotspotPanoramaOverlayMap",
   "image": {
    "levels": [
     {
      "url": "media/panorama_8D330B1E_874E_6A8E_41D2_0A89F6F28F55_0_HS_0_0_0_map.gif",
      "width": 32,
      "class": "ImageResourceLevel",
      "height": 16
     }
    ],
    "class": "ImageResource"
   },
   "pitch": -36.41
  }
 ],
 "class": "HotspotPanoramaOverlay",
 "areas": [
  {
   "click": "this.startPanoramaWithCamera(this.panorama_8D265541_874A_FEF2_41DE_A0BC495C5419, this.camera_85AB0770_8AC4_B249_41CE_F43F98BF73F9); this.mainPlayList.set('selectedIndex', 4)",
   "class": "HotspotPanoramaOverlayArea",
   "mapColor": "#FF0000"
  }
 ],
 "rollOverDisplay": false,
 "enabledInCardboard": true,
 "items": [
  {
   "image": "this.AnimatedImageResource_81FEF731_8A44_B3CB_41C8_C13C59CA40BA",
   "pitch": -36.41,
   "hfov": 27.88,
   "class": "HotspotPanoramaOverlayImage",
   "distance": 100,
   "yaw": -148.36
  }
 ],
 "id": "overlay_884AA93F_873E_368E_41D6_45EE36F198F6",
 "data": {
  "label": "Arrow 03a"
 }
},
{
 "useHandCursor": true,
 "maps": [
  {
   "hfov": 28.02,
   "yaw": 138.82,
   "class": "HotspotPanoramaOverlayMap",
   "image": {
    "levels": [
     {
      "url": "media/panorama_8D330B1E_874E_6A8E_41D2_0A89F6F28F55_0_HS_1_0_0_map.gif",
      "width": 32,
      "class": "ImageResourceLevel",
      "height": 16
     }
    ],
    "class": "ImageResource"
   },
   "pitch": -36
  }
 ],
 "class": "HotspotPanoramaOverlay",
 "areas": [
  {
   "click": "this.startPanoramaWithCamera(this.panorama_8D26F0D5_874A_1792_41C4_D544048ED703, this.camera_85A5D75C_8AC4_B278_41AE_ECA05E88BA01); this.mainPlayList.set('selectedIndex', 2)",
   "class": "HotspotPanoramaOverlayArea",
   "mapColor": "#FF0000"
  }
 ],
 "rollOverDisplay": false,
 "enabledInCardboard": true,
 "items": [
  {
   "image": "this.AnimatedImageResource_81FEB731_8A44_B3CB_41DA_27C1EB2C407C",
   "pitch": -36,
   "hfov": 28.02,
   "class": "HotspotPanoramaOverlayImage",
   "distance": 100,
   "yaw": 138.82
  }
 ],
 "id": "overlay_880B0A55_873E_EA92_41CA_06FEF9CF3EFB",
 "data": {
  "label": "Arrow 03a"
 }
},
{
 "inertia": false,
 "id": "panorama_8D277116_877E_F69E_41DF_02AF33F8B702_tcap0",
 "angle": 0,
 "distance": 50,
 "rotate": false,
 "hfov": 34.5,
 "class": "TripodCapPanoramaOverlay",
 "image": {
  "levels": [
   {
    "url": "media/panorama_8C698C0B_873E_2E76_41D9_D763A36BC981_tcap0.png",
    "width": 850,
    "class": "ImageResourceLevel",
    "height": 850
   }
  ],
  "class": "ImageResource"
 }
},
{
 "useHandCursor": true,
 "maps": [
  {
   "hfov": 29.66,
   "yaw": -105,
   "class": "HotspotPanoramaOverlayMap",
   "image": {
    "levels": [
     {
      "url": "media/panorama_8D277116_877E_F69E_41DF_02AF33F8B702_0_HS_0_0_0_map.gif",
      "width": 32,
      "class": "ImageResourceLevel",
      "height": 16
     }
    ],
    "class": "ImageResource"
   },
   "pitch": -31.09
  }
 ],
 "class": "HotspotPanoramaOverlay",
 "areas": [
  {
   "click": "this.mainPlayList.set('selectedIndex', 14)",
   "class": "HotspotPanoramaOverlayArea",
   "mapColor": "#FF0000"
  }
 ],
 "rollOverDisplay": false,
 "enabledInCardboard": true,
 "items": [
  {
   "image": "this.AnimatedImageResource_81FA5739_8A44_B23B_41CD_6464F44092FC",
   "pitch": -31.09,
   "hfov": 29.66,
   "class": "HotspotPanoramaOverlayImage",
   "distance": 100,
   "yaw": -105
  }
 ],
 "id": "overlay_884DBF24_8739_EAB3_41CA_0FAFED283D41",
 "data": {
  "label": "Arrow 03a"
 }
},
{
 "useHandCursor": true,
 "maps": [
  {
   "hfov": 30.04,
   "yaw": 166.64,
   "class": "HotspotPanoramaOverlayMap",
   "image": {
    "levels": [
     {
      "url": "media/panorama_8D277116_877E_F69E_41DF_02AF33F8B702_0_HS_1_0_0_map.gif",
      "width": 32,
      "class": "ImageResourceLevel",
      "height": 16
     }
    ],
    "class": "ImageResource"
   },
   "pitch": -29.86
  }
 ],
 "class": "HotspotPanoramaOverlay",
 "areas": [
  {
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "rollOverDisplay": false,
 "enabledInCardboard": true,
 "items": [
  {
   "image": "this.AnimatedImageResource_81FA2739_8A44_B23B_41BD_ED104DD54614",
   "pitch": -29.86,
   "hfov": 30.04,
   "class": "HotspotPanoramaOverlayImage",
   "distance": 100,
   "yaw": 166.64
  }
 ],
 "id": "overlay_88E34F41_87C6_2AF5_419D_25C08B2944F1",
 "data": {
  "label": "Arrow 03a"
 }
},
{
 "class": "AnimatedImageResource",
 "frameCount": 30,
 "frameDuration": 41,
 "levels": [
  {
   "url": "media/panorama_8D012E2E_874A_2A8E_4191_30904C062B4B_0_HS_0_0.png",
   "width": 925,
   "class": "ImageResourceLevel",
   "height": 540
  }
 ],
 "id": "AnimatedImageResource_81F4673B_8A44_B23F_41D0_CFDA6883DDDD",
 "rowCount": 6,
 "colCount": 5
},
{
 "class": "AnimatedImageResource",
 "frameCount": 30,
 "frameDuration": 41,
 "levels": [
  {
   "url": "media/panorama_8D012E2E_874A_2A8E_4191_30904C062B4B_0_HS_1_0.png",
   "width": 925,
   "class": "ImageResourceLevel",
   "height": 540
  }
 ],
 "id": "AnimatedImageResource_81F4273B_8A44_B23F_41C7_367BF834FFB0",
 "rowCount": 6,
 "colCount": 5
},
{
 "class": "AnimatedImageResource",
 "frameCount": 30,
 "frameDuration": 41,
 "levels": [
  {
   "url": "media/panorama_8D2E44C5_875A_FFF2_41D2_998B2388C555_0_HS_0_0.png",
   "width": 925,
   "class": "ImageResourceLevel",
   "height": 540
  }
 ],
 "id": "AnimatedImageResource_81FF8735_8A44_B3CB_41DA_DE040443B2FC",
 "rowCount": 6,
 "colCount": 5
},
{
 "class": "AnimatedImageResource",
 "frameCount": 30,
 "frameDuration": 41,
 "levels": [
  {
   "url": "media/panorama_8D2E44C5_875A_FFF2_41D2_998B2388C555_0_HS_1_0.png",
   "width": 925,
   "class": "ImageResourceLevel",
   "height": 540
  }
 ],
 "id": "AnimatedImageResource_81FF5735_8A44_B3CB_41CF_9C35A91E4DA3",
 "rowCount": 6,
 "colCount": 5
},
{
 "class": "AnimatedImageResource",
 "frameCount": 30,
 "frameDuration": 41,
 "levels": [
  {
   "url": "media/panorama_8D265541_874A_FEF2_41DE_A0BC495C5419_0_HS_0_0.png",
   "width": 925,
   "class": "ImageResourceLevel",
   "height": 540
  }
 ],
 "id": "AnimatedImageResource_81FE6731_8A44_B3CB_41E0_67773E8E22FA",
 "rowCount": 6,
 "colCount": 5
},
{
 "class": "AnimatedImageResource",
 "frameCount": 30,
 "frameDuration": 41,
 "levels": [
  {
   "url": "media/panorama_8D265541_874A_FEF2_41DE_A0BC495C5419_0_HS_1_0.png",
   "width": 925,
   "class": "ImageResourceLevel",
   "height": 540
  }
 ],
 "id": "AnimatedImageResource_81FE3732_8A44_B3C9_41DB_4595C47372FC",
 "rowCount": 6,
 "colCount": 5
},
{
 "class": "AnimatedImageResource",
 "frameCount": 30,
 "frameDuration": 41,
 "levels": [
  {
   "url": "media/panorama_8D342236_875E_1A9E_41D1_D2B4A3232FA4_0_HS_0_0.png",
   "width": 925,
   "class": "ImageResourceLevel",
   "height": 540
  }
 ],
 "id": "AnimatedImageResource_81FE3734_8A44_B3C9_41D3_DA94DFE2EBED",
 "rowCount": 6,
 "colCount": 5
},
{
 "class": "AnimatedImageResource",
 "frameCount": 30,
 "frameDuration": 41,
 "levels": [
  {
   "url": "media/panorama_8D342236_875E_1A9E_41D1_D2B4A3232FA4_0_HS_1_0.png",
   "width": 925,
   "class": "ImageResourceLevel",
   "height": 540
  }
 ],
 "id": "AnimatedImageResource_81FE0734_8A44_B3C9_41B5_8EEDE4E83FC0",
 "rowCount": 6,
 "colCount": 5
},
{
 "class": "AnimatedImageResource",
 "frameCount": 30,
 "frameDuration": 41,
 "levels": [
  {
   "url": "media/panorama_8D342236_875E_1A9E_41D1_D2B4A3232FA4_0_HS_2_0.png",
   "width": 925,
   "class": "ImageResourceLevel",
   "height": 540
  }
 ],
 "id": "AnimatedImageResource_81FFE735_8A44_B3CB_41D1_C291087D25A8",
 "rowCount": 6,
 "colCount": 5
},
{
 "class": "AnimatedImageResource",
 "frameCount": 30,
 "frameDuration": 41,
 "levels": [
  {
   "url": "media/panorama_8D3CFB4B_877A_6AF6_41CB_7F0920056CFD_0_HS_0_0.png",
   "width": 925,
   "class": "ImageResourceLevel",
   "height": 540
  }
 ],
 "id": "AnimatedImageResource_81FBD739_8A44_B23B_41A6_0603FC1CF299",
 "rowCount": 6,
 "colCount": 5
},
{
 "class": "AnimatedImageResource",
 "frameCount": 30,
 "frameDuration": 41,
 "levels": [
  {
   "url": "media/panorama_8D3CFB4B_877A_6AF6_41CB_7F0920056CFD_0_HS_1_0.png",
   "width": 925,
   "class": "ImageResourceLevel",
   "height": 540
  }
 ],
 "id": "AnimatedImageResource_81FB7739_8A44_B23B_4194_674638BE2A49",
 "rowCount": 6,
 "colCount": 5
},
{
 "class": "AnimatedImageResource",
 "frameCount": 30,
 "frameDuration": 41,
 "levels": [
  {
   "url": "media/panorama_8D26FEDC_874A_2B92_41BD_9E25154EBA39_0_HS_0_0.png",
   "width": 925,
   "class": "ImageResourceLevel",
   "height": 540
  }
 ],
 "id": "AnimatedImageResource_81F83737_8A44_B237_41DC_F808112CC6CE",
 "rowCount": 6,
 "colCount": 5
},
{
 "class": "AnimatedImageResource",
 "frameCount": 30,
 "frameDuration": 41,
 "levels": [
  {
   "url": "media/panorama_8D26FEDC_874A_2B92_41BD_9E25154EBA39_0_HS_1_0.png",
   "width": 925,
   "class": "ImageResourceLevel",
   "height": 540
  }
 ],
 "id": "AnimatedImageResource_81F9E737_8A44_B237_41D6_D11211AC5500",
 "rowCount": 6,
 "colCount": 5
},
{
 "class": "AnimatedImageResource",
 "frameCount": 30,
 "frameDuration": 41,
 "levels": [
  {
   "url": "media/panorama_8D26FEDC_874A_2B92_41BD_9E25154EBA39_0_HS_2_0.png",
   "width": 925,
   "class": "ImageResourceLevel",
   "height": 540
  }
 ],
 "id": "AnimatedImageResource_81F9B737_8A44_B237_41D0_D163DAE0A751",
 "rowCount": 6,
 "colCount": 5
},
{
 "class": "AnimatedImageResource",
 "frameCount": 30,
 "frameDuration": 41,
 "levels": [
  {
   "url": "media/panorama_8D1FC4A9_8746_1FB2_4199_50FEC28B1F42_0_HS_0_0.png",
   "width": 925,
   "class": "ImageResourceLevel",
   "height": 540
  }
 ],
 "id": "AnimatedImageResource_81FB173A_8A44_B239_41CE_DEFE9288C6A2",
 "rowCount": 6,
 "colCount": 5
},
{
 "class": "AnimatedImageResource",
 "frameCount": 30,
 "frameDuration": 41,
 "levels": [
  {
   "url": "media/panorama_8D1FC4A9_8746_1FB2_4199_50FEC28B1F42_0_HS_1_0.png",
   "width": 925,
   "class": "ImageResourceLevel",
   "height": 540
  }
 ],
 "id": "AnimatedImageResource_81F4B73A_8A44_B239_41CE_43C4BF0EC835",
 "rowCount": 6,
 "colCount": 5
},
{
 "class": "AnimatedImageResource",
 "frameCount": 30,
 "frameDuration": 41,
 "levels": [
  {
   "url": "media/panorama_8C698C0B_873E_2E76_41D9_D763A36BC981_0_HS_0_0.png",
   "width": 925,
   "class": "ImageResourceLevel",
   "height": 540
  }
 ],
 "id": "AnimatedImageResource_81FCE72D_8A44_B3DB_41D1_F8ACF9BB223C",
 "rowCount": 6,
 "colCount": 5
},
{
 "class": "AnimatedImageResource",
 "frameCount": 30,
 "frameDuration": 41,
 "levels": [
  {
   "url": "media/panorama_8D349E28_875A_2AB3_4191_8B7C205E4B8B_0_HS_0_0.png",
   "width": 925,
   "class": "ImageResourceLevel",
   "height": 540
  }
 ],
 "id": "AnimatedImageResource_81FFF732_8A44_B3C9_41BD_64F9EF7D6725",
 "rowCount": 6,
 "colCount": 5
},
{
 "class": "AnimatedImageResource",
 "frameCount": 30,
 "frameDuration": 41,
 "levels": [
  {
   "url": "media/panorama_8D349E28_875A_2AB3_4191_8B7C205E4B8B_0_HS_1_0.png",
   "width": 925,
   "class": "ImageResourceLevel",
   "height": 540
  }
 ],
 "id": "AnimatedImageResource_81FFC732_8A44_B3C9_41AC_CFC18D524862",
 "rowCount": 6,
 "colCount": 5
},
{
 "class": "AnimatedImageResource",
 "frameCount": 30,
 "frameDuration": 41,
 "levels": [
  {
   "url": "media/panorama_8D349E28_875A_2AB3_4191_8B7C205E4B8B_0_HS_2_0.png",
   "width": 925,
   "class": "ImageResourceLevel",
   "height": 540
  }
 ],
 "id": "AnimatedImageResource_81FF7733_8A44_B3CF_41E0_6C8BD9D17F18",
 "rowCount": 6,
 "colCount": 5
},
{
 "class": "AnimatedImageResource",
 "frameCount": 30,
 "frameDuration": 41,
 "levels": [
  {
   "url": "media/panorama_8D21215C_8746_3692_4179_F0E8FC89F914_0_HS_0_0.png",
   "width": 925,
   "class": "ImageResourceLevel",
   "height": 540
  }
 ],
 "id": "AnimatedImageResource_81F96738_8A44_B239_41CE_4EAFE7AFA793",
 "rowCount": 6,
 "colCount": 5
},
{
 "class": "AnimatedImageResource",
 "frameCount": 30,
 "frameDuration": 41,
 "levels": [
  {
   "url": "media/panorama_8D3FB7D2_877A_1996_41D4_7689BB9D7D11_0_HS_0_0.png",
   "width": 925,
   "class": "ImageResourceLevel",
   "height": 540
  }
 ],
 "id": "AnimatedImageResource_81FAF738_8A44_B239_41D1_64FA68726C6A",
 "rowCount": 6,
 "colCount": 5
},
{
 "class": "AnimatedImageResource",
 "frameCount": 30,
 "frameDuration": 41,
 "levels": [
  {
   "url": "media/panorama_8D3FB7D2_877A_1996_41D4_7689BB9D7D11_0_HS_1_0.png",
   "width": 925,
   "class": "ImageResourceLevel",
   "height": 540
  }
 ],
 "id": "AnimatedImageResource_81FAB738_8A44_B239_41E0_D5DA8B49B680",
 "rowCount": 6,
 "colCount": 5
},
{
 "class": "AnimatedImageResource",
 "frameCount": 30,
 "frameDuration": 41,
 "levels": [
  {
   "url": "media/panorama_8D2AB845_875A_36FD_41C5_7712FAF92241_0_HS_0_0.png",
   "width": 925,
   "class": "ImageResourceLevel",
   "height": 540
  }
 ],
 "id": "AnimatedImageResource_81FEB734_8A44_B3C9_41B5_438D8C422B36",
 "rowCount": 6,
 "colCount": 5
},
{
 "class": "AnimatedImageResource",
 "frameCount": 30,
 "frameDuration": 41,
 "levels": [
  {
   "url": "media/panorama_8D2AB845_875A_36FD_41C5_7712FAF92241_0_HS_1_0.png",
   "width": 925,
   "class": "ImageResourceLevel",
   "height": 540
  }
 ],
 "id": "AnimatedImageResource_81FE8734_8A44_B3C9_41CB_43D2A075CA7B",
 "rowCount": 6,
 "colCount": 5
},
{
 "class": "AnimatedImageResource",
 "frameCount": 30,
 "frameDuration": 41,
 "levels": [
  {
   "url": "media/panorama_8D3214D1_874A_3F92_41B8_DE3A41B87CDE_0_HS_0_0.png",
   "width": 925,
   "class": "ImageResourceLevel",
   "height": 540
  }
 ],
 "id": "AnimatedImageResource_81F8F736_8A44_B3C9_41CC_75F090F4A264",
 "rowCount": 6,
 "colCount": 5
},
{
 "class": "AnimatedImageResource",
 "frameCount": 30,
 "frameDuration": 41,
 "levels": [
  {
   "url": "media/panorama_8D3214D1_874A_3F92_41B8_DE3A41B87CDE_0_HS_1_0.png",
   "width": 925,
   "class": "ImageResourceLevel",
   "height": 540
  }
 ],
 "id": "AnimatedImageResource_81F8C736_8A44_B3C9_4195_6B01318E0587",
 "rowCount": 6,
 "colCount": 5
},
{
 "class": "AnimatedImageResource",
 "frameCount": 30,
 "frameDuration": 41,
 "levels": [
  {
   "url": "media/panorama_8D3214D1_874A_3F92_41B8_DE3A41B87CDE_0_HS_2_0.png",
   "width": 925,
   "class": "ImageResourceLevel",
   "height": 540
  }
 ],
 "id": "AnimatedImageResource_81F88736_8A44_B3C9_41D3_8353B127C18D",
 "rowCount": 6,
 "colCount": 5
},
{
 "class": "AnimatedImageResource",
 "frameCount": 30,
 "frameDuration": 41,
 "levels": [
  {
   "url": "media/panorama_8D26F0D5_874A_1792_41C4_D544048ED703_0_HS_0_0.png",
   "width": 925,
   "class": "ImageResourceLevel",
   "height": 540
  }
 ],
 "id": "AnimatedImageResource_81FDB730_8A44_B3C9_41C2_483137EF39F6",
 "rowCount": 6,
 "colCount": 5
},
{
 "class": "AnimatedImageResource",
 "frameCount": 30,
 "frameDuration": 41,
 "levels": [
  {
   "url": "media/panorama_8D26F0D5_874A_1792_41C4_D544048ED703_0_HS_1_0.png",
   "width": 925,
   "class": "ImageResourceLevel",
   "height": 540
  }
 ],
 "id": "AnimatedImageResource_81FD9730_8A44_B3C9_41D4_12FA084D5691",
 "rowCount": 6,
 "colCount": 5
},
{
 "class": "AnimatedImageResource",
 "frameCount": 30,
 "frameDuration": 41,
 "levels": [
  {
   "url": "media/panorama_8D26F0D5_874A_1792_41C4_D544048ED703_0_HS_2_0.png",
   "width": 925,
   "class": "ImageResourceLevel",
   "height": 540
  }
 ],
 "id": "AnimatedImageResource_81FD5730_8A44_B3C9_41DE_9225D04E93A1",
 "rowCount": 6,
 "colCount": 5
},
{
 "class": "AnimatedImageResource",
 "frameCount": 30,
 "frameDuration": 41,
 "levels": [
  {
   "url": "media/panorama_8D23D510_8746_1E92_41AA_543AD4625D58_0_HS_0_0.png",
   "width": 925,
   "class": "ImageResourceLevel",
   "height": 540
  }
 ],
 "id": "AnimatedImageResource_81FC672F_8A44_B3D7_41CC_85131EE4287D",
 "rowCount": 6,
 "colCount": 5
},
{
 "class": "AnimatedImageResource",
 "frameCount": 30,
 "frameDuration": 41,
 "levels": [
  {
   "url": "media/panorama_8D23D510_8746_1E92_41AA_543AD4625D58_0_HS_1_0.png",
   "width": 925,
   "class": "ImageResourceLevel",
   "height": 540
  }
 ],
 "id": "AnimatedImageResource_81FC472F_8A44_B3D7_41D4_246250F79A33",
 "rowCount": 6,
 "colCount": 5
},
{
 "class": "AnimatedImageResource",
 "frameCount": 30,
 "frameDuration": 41,
 "levels": [
  {
   "url": "media/panorama_8D23D510_8746_1E92_41AA_543AD4625D58_0_HS_2_0.png",
   "width": 925,
   "class": "ImageResourceLevel",
   "height": 540
  }
 ],
 "id": "AnimatedImageResource_81FC0730_8A44_B3C9_41C7_52F84C22AA7E",
 "rowCount": 6,
 "colCount": 5
},
{
 "class": "AnimatedImageResource",
 "frameCount": 30,
 "frameDuration": 41,
 "levels": [
  {
   "url": "media/panorama_8D330B1E_874E_6A8E_41D2_0A89F6F28F55_0_HS_0_0.png",
   "width": 925,
   "class": "ImageResourceLevel",
   "height": 540
  }
 ],
 "id": "AnimatedImageResource_81FEF731_8A44_B3CB_41C8_C13C59CA40BA",
 "rowCount": 6,
 "colCount": 5
},
{
 "class": "AnimatedImageResource",
 "frameCount": 30,
 "frameDuration": 41,
 "levels": [
  {
   "url": "media/panorama_8D330B1E_874E_6A8E_41D2_0A89F6F28F55_0_HS_1_0.png",
   "width": 925,
   "class": "ImageResourceLevel",
   "height": 540
  }
 ],
 "id": "AnimatedImageResource_81FEB731_8A44_B3CB_41DA_27C1EB2C407C",
 "rowCount": 6,
 "colCount": 5
},
{
 "class": "AnimatedImageResource",
 "frameCount": 30,
 "frameDuration": 41,
 "levels": [
  {
   "url": "media/panorama_8D277116_877E_F69E_41DF_02AF33F8B702_0_HS_0_0.png",
   "width": 925,
   "class": "ImageResourceLevel",
   "height": 540
  }
 ],
 "id": "AnimatedImageResource_81FA5739_8A44_B23B_41CD_6464F44092FC",
 "rowCount": 6,
 "colCount": 5
},
{
 "class": "AnimatedImageResource",
 "frameCount": 30,
 "frameDuration": 41,
 "levels": [
  {
   "url": "media/panorama_8D277116_877E_F69E_41DF_02AF33F8B702_0_HS_1_0.png",
   "width": 925,
   "class": "ImageResourceLevel",
   "height": 540
  }
 ],
 "id": "AnimatedImageResource_81FA2739_8A44_B23B_41BD_ED104DD54614",
 "rowCount": 6,
 "colCount": 5
}],
 "scrollBarMargin": 2,
 "propagateClick": false,
 "minWidth": 20,
 "vrPolyfillScale": 0.7,
 "verticalAlign": "top",
 "paddingRight": 0,
 "mobileMipmappingEnabled": false,
 "desktopMipmappingEnabled": false,
 "scrollBarVisible": "rollOver",
 "backgroundPreloadEnabled": true,
 "borderSize": 0,
 "paddingBottom": 0,
 "gap": 10,
 "paddingTop": 0,
 "contentOpaque": false,
 "shadow": false,
 "scrollBarColor": "#000000",
 "defaultVRPointer": "laser",
 "data": {
  "name": "Player502"
 },
 "downloadEnabled": true,
 "layout": "absolute",
 "paddingLeft": 0,
 "scrollBarOpacity": 0.5
};

    
    function HistoryData(playList) {
        this.playList = playList;
        this.list = [];
        this.pointer = -1;
    }

    HistoryData.prototype.add = function(index){
        if(this.pointer < this.list.length && this.list[this.pointer] == index) {
            return;
        }
        ++this.pointer;
        this.list.splice(this.pointer, this.list.length - this.pointer, index);
    };

    HistoryData.prototype.back = function(){
        if(!this.canBack()) return;
        this.playList.set('selectedIndex', this.list[--this.pointer]);
    };

    HistoryData.prototype.forward = function(){
        if(!this.canForward()) return;
        this.playList.set('selectedIndex', this.list[++this.pointer]);
    };

    HistoryData.prototype.canBack = function(){
        return this.pointer > 0;
    };

    HistoryData.prototype.canForward = function(){
        return this.pointer >= 0 && this.pointer < this.list.length-1;
    };
    //

    if(script.data == undefined)
        script.data = {};
    script.data["history"] = {};    //playListID -> HistoryData

    TDV.PlayerAPI.defineScript(script);
})();
