<script>
  document.addEventListener("DOMContentLoaded", () => {
    const btn = document.getElementById('btn-test-claim');

    btn.addEventListener('click', () => {
      playerState.markMeMeEarned("water");
      playerState.save();

      btn.classList.add("claimed");
      btn.textContent = "✅ Token Claimed";
    });
  });
</script>
