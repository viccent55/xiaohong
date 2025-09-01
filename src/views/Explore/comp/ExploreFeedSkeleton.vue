<template>
  <div class="skeleton-feed-wrapper">
    <div class="skeleton-media-container"></div>
    <div class="skeleton-feed-footer">
      <div class="skeleton-title"></div>
      <div class="skeleton-author-wrapper">
        <div class="skeleton-info-wrapper">
          <div class="skeleton-avatar"></div>
          <div class="skeleton-name"></div>
        </div>
        <div class="skeleton-like-wrapper">
          <div class="skeleton-heart"></div>
          <div class="skeleton-count"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="less">
  @keyframes skeleton-animation {
    0% {
      background-color: hsl(200, 20%, 80%);
    }
    100% {
      background-color: hsl(200, 20%, 95%);
    }
  }

  .skeleton-feed-wrapper {
    width: 100%;
    height: fit-content;
    background: var(--background-color);
    border-radius: 16px;
    padding-bottom: 12px;
  }

  .skeleton-media-container {
    width: 100%;
    // Give it a random aspect ratio to mimic real content
    aspect-ratio: 1.4 / 1.2;
    background-color: #eee;
    border-radius: 16px;
    margin-bottom: 12px;
    animation: skeleton-animation 1s linear infinite alternate;
  }

  .skeleton-feed-footer {
    padding: 0 12px;
  }

  .skeleton-title {
    width: 100%;
    height: 20px;
    background-color: #eee;
    border-radius: 4px;
    margin-bottom: 8px;
    animation: skeleton-animation 1s linear infinite alternate;
  }

  .skeleton-author-wrapper {
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .skeleton-info-wrapper {
    display: flex;
    align-items: center;
  }

  .skeleton-avatar {
    width: 20px;
    height: 20px;
    border-radius: 50%;
    background-color: #eee;
    margin-right: 8px;
    animation: skeleton-animation 1s linear infinite alternate;
  }

  .skeleton-name {
    width: 60px;
    height: 16px;
    background-color: #eee;
    border-radius: 4px;
    animation: skeleton-animation 1s linear infinite alternate;
  }

  .skeleton-like-wrapper {
    display: flex;
    align-items: center;
  }

  .skeleton-heart {
    width: 14px;
    height: 14px;
    background-color: #eee;
    border-radius: 2px;
    margin-right: 4px;
    animation: skeleton-animation 1s linear infinite alternate;
  }

  .skeleton-count {
    width: 20px;
    height: 14px;
    background-color: #eee;
    border-radius: 4px;
    animation: skeleton-animation 1s linear infinite alternate;
  }
</style>
