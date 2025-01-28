import React, {useCallback, useEffect, useMemo, useState} from 'react';
import * as RN from 'react-native';
import {Types, Fonts, Theme} from '@sleeperhq/mini-core';
import {FlashList} from '@shopify/flash-list';
import {Topic} from '@sleeperhq/mini-core/declarations/types';
import VideoRow from './VideoRow';
import { useMergeState } from '../../shared/utils';
import axios from "axios";

const PAGE_LIMIT = 20;
const EMPTY_OBJECT = {};

const PLAYLIST_ID = 'PLj5YOlMjbtAK4lUSUeVku7UWchD00Qnon';
const API_KEY = 'AIzaSyB93NN4D4p6gPq3I5mAxq98m4ApYrf1sZ0';

const fetchYouTubePlaylistItems = async (playlistId, pageToken) => {
  const response = await axios.get('https://www.googleapis.com/youtube/v3/playlistItems', {
    params: {
      part: 'snippet',
      playlistId,
      maxResults: PAGE_LIMIT,
      key: API_KEY,
      pageToken
    }
  });
  return response.data;
};

const VideoTool = (props) => {
  const { context } = props;
  const [state, setState] = useState({
    page: 0,
    isRefreshing: false,
    paginatedVideosMap: EMPTY_OBJECT,
    nextPageToken: null,
  });
  
  const { page, isRefreshing, paginatedVideosMap, nextPageToken } = state;

  // Fetch videos when needed
  const fetchVideos = useCallback(async () => {
    // Prevent fetching if already refreshing
    if (isRefreshing) return;

    setState(prevState => ({ ...prevState, isRefreshing: true }));

    try {
      const data = await fetchYouTubePlaylistItems(PLAYLIST_ID, nextPageToken);
      const videos = data.items.map(item => ({
        topic_id: item.snippet.resourceId.videoId,
        ...item.snippet,
      }));

      setState(prevState => ({
        ...prevState,
        paginatedVideosMap: {
          ...prevState.paginatedVideosMap,
          [prevState.page]: videos,
        },
        nextPageToken: data.nextPageToken,
        isRefreshing: false,
      }));
    } catch (error) {
      console.error('Error fetching videos:', error);
      setState(prevState => ({ ...prevState, isRefreshing: false }));
    }
  }, [isRefreshing, nextPageToken, page]);

  useEffect(() => {
    if (page === 0 || nextPageToken) {
      fetchVideos();
    }
  }, [page]);

  // Combine all videos into a single array
  const videos = useMemo(() => {
    return Object.values(paginatedVideosMap).flat();
  }, [paginatedVideosMap]);

  // Load more videos when reaching the end of the list
  const onEndReached = useCallback(() => {
    if (!isRefreshing && nextPageToken) {
      setState(prevState => ({
        ...prevState,
        page: prevState.page + 1,
      }));
    }
  }, [nextPageToken, isRefreshing]);

  // Refresh the video list
  const onRefresh = useCallback(() => {
    setState({
      page: 0,
      isRefreshing: true,
      paginatedVideosMap: {},
      nextPageToken: null,
    });
    fetchVideos()
  }, []);

  // Render each video
  const renderVideo = useCallback(({ item: video }) => (
    <VideoRow videoTopic={video} />
  ), []);

  return (
    <FlashList
      data={videos}
      ListEmptyComponent={
        <RN.Text style={styles.errorText}>No Videos.</RN.Text>
      }
      keyExtractor={video => video.topic_id}
      renderItem={renderVideo}
      estimatedItemSize={100}
      onEndReached={onEndReached}
      refreshControl={
        <RN.RefreshControl
          refreshing={isRefreshing}
          onRefresh={onRefresh}
          tintColor="white"
        />
      }
    />
  );
};
const styles = RN.StyleSheet.create({
  titleText: {
    fontSize: 28,
    color: 'white',
    fontFamily: Fonts.POPPINS_BOLD,
    marginVertical: 8,
    marginHorizontal: 16,
  },
  errorText: {
    fontSize: 12,
    fontFamily: Fonts.INTER_SEMIBOLD,
    color: 'white',
    textAlign: 'center',
    marginHorizontal: 16,
    marginVertical: 16,
  },
  videoContainer: {
    paddingHorizontal: 16,
    paddingVertical: 6,
  },
  videoHeaderContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  videoThumbnail: {
    height: 72,
    aspectRatio: 1.33,
    borderRadius: 8,
    overflow: 'hidden',
  },
  videoContentContainer: {
    flex: 1,
    paddingLeft: 8,
  },
  videoMetaContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  videoMetaText: {
    fontFamily: Fonts.INTER_REGULAR,
    fontSize: 12,
    marginBottom: 4,
    color: Theme.gray300,
  },
  videoTitleText: {
    fontFamily: Fonts.INTER_SEMIBOLD,
    color: 'white',
    fontSize: 14,
    flex: 1,
  },
});

export default VideoTool;
