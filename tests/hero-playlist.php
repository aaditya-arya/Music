<?php
// Run with: wp eval-file wp-content/themes/akshar-engineering/tests/hero-playlist.php
function aes_playlist_assert($condition, $message) { if (!$condition) throw new RuntimeException($message); }
$items = [];
for ($i = 1; $i <= 5; $i++) $items[] = ['id' => 'clip-' . $i, 'url' => 'https://example.com/clip-' . $i . '.mp4'];
$html = '<section><div class="absolute inset-0 z-0"><video id="heroVideo" src="https://example.com/stale.mp4" data-playlist="old.mp4"><source src="old.mp4"></video><video id="heroVideoBuffer"><source src="old-buffer.mp4"></video></div><h1>Keep this content</h1></section>';
$rendered = aes_apply_hero_video($html, true, 0, $items);
$processor = new WP_HTML_Tag_Processor($rendered); $processor->next_tag('video');
aes_playlist_assert(json_decode($processor->get_attribute('data-aes-playlist'), true) === array_column($items, 'url'), 'All five clips must reach the player.');
aes_playlist_assert($processor->get_attribute('src') === null && $processor->get_attribute('data-playlist') === null, 'Stale sources must be cleared.');
$removed = $items[2]['url']; array_splice($items, 2, 1);
$rendered = aes_apply_hero_video($html, true, 0, $items);
aes_playlist_assert(strpos($rendered, $removed) === false, 'Removing the third clip must remove it everywhere.');
aes_playlist_assert(strpos($rendered, 'clip-5.mp4') !== false, 'Later clips must remain.');
$empty = aes_apply_hero_video($html, true, 0, []);
aes_playlist_assert(strpos($empty, '<video') === false && strpos($empty, 'Keep this content') !== false, 'An empty playlist removes both videos, preserving page copy.');
$single = aes_apply_hero_video($empty, true, 0, [$items[0]]);
aes_playlist_assert(substr_count($single, '<video') === 1, 'One clip can be added after all videos have been removed.');
aes_playlist_assert(is_wp_error(aes_validate_hero_playlist([['url' => 'javascript:alert(1)']])), 'Unsafe protocols must be rejected.');
aes_playlist_assert(is_wp_error(aes_validate_hero_playlist([['url' => 'https://example.com/document.pdf']])), 'Non-video files must be rejected.');
aes_playlist_assert(aes_validate_hero_playlist([]) === [], 'An intentional empty list is valid.');
echo "Hero playlist regression checks passed.\n";
