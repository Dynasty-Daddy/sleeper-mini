import React from 'react';
import * as RN from 'react-native';
import {Fonts, Theme} from '@sleeperhq/mini-core';
import { formatTimeSinceWithDayOfWeek } from '../../shared/utils';

const baseURL = "https://www.youtube.com/watch?v="

type VideoRowProps = {
  videoTopic: any;
};

const VideoRow = (props: VideoRowProps) => {
  const {videoTopic} = props;
  const {title,  channelTitle, thumbnails, publishedAt, topic_id} = videoTopic;
  // If we're missing core info, do not render...
  if (!title || !thumbnails || !channelTitle) {
    return null;
  }
  const onPress = async () => {
    const canOpen = await RN.Linking.canOpenURL(baseURL + topic_id);

    if (canOpen) {
      try {
        await RN.Linking.openURL(baseURL + topic_id);
        return;
      } catch (err) {}
    }

    // Handle link open failure or the non-supported case...
    RN.Alert.alert(
      'Could not open link',
      'Would you like to copy it to your clipboard?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'OK',
          onPress: () => RN.Clipboard.setString(baseURL + topic_id),
        },
      ],
    );
  };

  return (
    <RN.TouchableOpacity style={styles.videoContainer} onPress={onPress}>
      <RN.View style={styles.videoHeaderContainer}>
        {thumbnails["default"] && (
          <RN.Image
            style={styles.videoThumbnail}
            source={{uri: thumbnails["high"].url}}
          />
        )}
        <RN.View style={styles.videoContentContainer}>
          <RN.View style={styles.videoMetaContainer}>
            {channelTitle && (
              <RN.Text style={styles.videoMetaText}>
                {channelTitle}
                {' • '}
              </RN.Text>
            )}
            <RN.Text style={styles.videoMetaText}>
              {formatTimeSinceWithDayOfWeek(publishedAt)}
            </RN.Text>
          </RN.View>
          <RN.Text style={styles.videoTitleText}>
            {title}
          </RN.Text>
        </RN.View>
      </RN.View>
    </RN.TouchableOpacity>
  );
};

const styles = RN.StyleSheet.create({
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

export default VideoRow;
