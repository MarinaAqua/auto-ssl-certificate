export default {
    async fetch(request, env, ctx) {
      const url = new URL(request.url);
      
      // Handling API requests
      if (url.pathname === '/api/add-ssl' && request.method === 'POST') {
        return handleApiRequest(request);
      }
      
      // Return to HTML page
      return new Response(getHTML(), {
        headers: {
          'Content-Type': 'text/html; charset=utf-8',
        },
      });
    },
  };
  
  async function handleApiRequest(request) {
    try {
      const { email, zone_id, api_key } = await request.json();
      
      // Validating Input
      if (!email || !zone_id || !api_key) {
        return new Response(JSON.stringify({
          success: false,
          errors: ['All fields are required']
        }), {
          status: 400,
          headers: { 'Content-Type': 'application/json' }
        });
      }
      
      // Call Cloudflare API
      const response = await fetch(`https://api.cloudflare.com/client/v4/zones/${zone_id}/ssl/universal/settings`, {
        method: 'PATCH',
        headers: {
          'X-Auth-Email': email,
          'X-Auth-Key': api_key,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          enabled: true,
          certificate_authority: "ssl_com"
        }),
      });
      
      const result = await response.json();
      
      return new Response(JSON.stringify(result), {
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'POST',
          'Access-Control-Allow-Headers': 'Content-Type',
        },
      });
      
    } catch (error) {
      return new Response(JSON.stringify({
        success: false,
        errors: [`Request failed: ${error.message}`]
      }), {
        status: 500,
        headers: { 
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        }
      });
    }
  }
  
  function getHTML() {
    return `<!DOCTYPE html>
  <html lang="id">
  <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Tambahkan sertifikat SSL secara otomatis ke nama domain</title>
  <!-- Font Awesome v6 (icon terbaru) -->
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css">

  <link rel="icon" href="https://raw.githubusercontent.com/MarinaAqua/MarinaAqua/main/my-profil.png"/>
  <script src="https://cdn.tailwindcss.com"></script>
      <style>
          * {
              box-sizing: border-box;
              margin: 0;
              padding: 0;
              font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          }
          
          body {
              background: linear-gradient(135deg, #1a2a6c, #b21f1f, #fdbb2d);
              color: #333;
              min-height: 100vh;
              display: flex;
              justify-content: center;
              align-items: center;
              padding: 10px;
          }
          
          .container {
              background-color: rgba(255, 255, 255, 0.95);
              border-radius: 12px;
              box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
              width: 100%;
              max-width: 500px;
              padding: 30px;
          }
          
          h1 {
              text-align: center;
              margin-bottom: 25px;
              color: #2c3e50;
              font-size: 24px;
              position: relative;
              padding-bottom: 15px;
          }
          
          h1:after {
              content: '';
              position: absolute;
              bottom: 0;
              left: 25%;
              width: 50%;
              height: 3px;
              background: linear-gradient(to right, #1a2a6c, #b21f1f, #fdbb2d);
              border-radius: 3px;
          }
          
          .register-btn {
              display: block;
              background: linear-gradient(to right, #1a2a6c, #3498db);
              color: white;
              text-align: center;
              text-decoration: none;
              border-radius: 8px;
              padding: 14px 20px;
              font-size: 16px;
              font-weight: 600;
              margin-bottom: 25px;
              transition: all 0.3s;
              box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
          }
          
          .register-btn:hover {
              transform: translateY(-2px);
              box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
          }
          
          .form-group {
              margin-bottom: 20px;
          }
          
          label {
              display: block;
              margin-bottom: 8px;
              font-weight: 600;
              color: #2c3e50;
          }
          
          input[type="text"], input[type="email"] {
              width: 100%;
              padding: 12px 15px;
              border: 2px solid #e0e0e0;
              border-radius: 8px;
              font-size: 16px;
              transition: all 0.3s;
          }
          
          input[type="text"]:focus, input[type="email"]:focus {
              border-color: #3498db;
              box-shadow: 0 0 0 3px rgba(52, 152, 219, 0.2);
              outline: none;
          }
          
          .error {
              border-color: #e74c3c !important;
              box-shadow: 0 0 0 3px rgba(231, 76, 60, 0.2) !important;
          }
          
          .error-message {
              color: #e74c3c;
              font-size: 14px;
              margin-top: 5px;
              display: none;
          }
          
          .btn {
              background: linear-gradient(to right, #1a2a6c, #b21f1f);
              color: white;
              border: none;
              border-radius: 8px;
              padding: 14px 20px;
              font-size: 16px;
              font-weight: 600;
              cursor: pointer;
              width: 100%;
              transition: all 0.3s;
              display: flex;
              justify-content: center;
              align-items: center;
          }
          
          .btn:hover {
              transform: translateY(-2px);
              box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
          }
          
          .btn:active {
              transform: translateY(0);
          }
          
          .spinner {
              display: none;
              width: 20px;
              height: 20px;
              border: 3px solid rgba(255, 255, 255, 0.3);
              border-radius: 50%;
              border-top-color: white;
              animation: spin 1s ease-in-out infinite;
              margin-right: 10px;
          }
          
          @keyframes spin {
              to { transform: rotate(360deg); }
          }
          
          .result {
              margin-top: 20px;
              padding: 15px;
              border-radius: 8px;
              display: none;
              text-align: center;
              font-weight: 600;
          }
          
          .success {
              background-color: #d4edda;
              color: #155724;
              border: 1px solid #c3e6cb;
          }
          
          .error-result {
              background-color: #f8d7da;
              color: #721c24;
              border: 1px solid #f5c6cb;
          }
          
          .info-box {
              background-color: #e8f4fd;
              border-left: 4px solid #3498db;
              padding: 15px;
              margin-top: 25px;
              border-radius: 0 8px 8px 0;
          }
          
          .info-box h3 {
              color: #2c3e50;
              margin-bottom: 10px;
              font-size: 16px;
          }
          
          .info-box p {
              font-size: 14px;
              line-height: 1.5;
              color: #34495e;
          }
          
          .footer {
              text-align: center;
              margin-top: 20px;
              font-size: 12px;
              color: #7f8c8d;
          }
    .glow-box-content {
      position: relative;
      z-index: 1;
      font-size: clamp(2.5rem, 6vw, 3rem);
      font-weight: bold;
      background: linear-gradient(270deg, red, orange, yellow, green, cyan, blue, violet, red);
      background-size: 400%;
      background-clip: text;
      -webkit-background-clip: text;
      color: transparent;
      animation: shimmerText 5s linear infinite;
      text-align: center;
      text-shadow: 0 0 10px rgba(255,255,255,0.3), 0 0 20px rgba(0,255,255,0.2);
    }

    @keyframes shimmerText {
      0% { background-position: 200% center; }
      100% { background-position: 0% center; }
    }
    .social-footer {
      margin-top: 1rem;
      margin-bottom:1rem;
      text-align: center;
      font-size: 1.8rem;
    }
    .social-footer a {
      color: #ccc;
      margin: 0 10px;
      transition: color 0.3s;
    }
    .social-footer a:hover {
      color: #fff;
    }
    
    .copyright-footer {
      text-align: center;
      margin-top: 0.8rem;
      margin-bottom:1rem;
      font-size: 0.9rem;
      color: #777;
    }
      /* Rainbow Text Styles */
    .rainbow-text {
      font-weight: bold;
      text-align: center;
      text-transform: uppercase;
      background: linear-gradient(270deg, red, orange, yellow, green, cyan, blue, violet, red);
      background-size: 200% auto;
      color: transparent;
      background-clip: text;
      -webkit-background-clip: text;
      animation: shimmer 5s linear infinite;
      text-shadow: 0 0 5px #fff5, 0 0 5px #0ff6;
    }

    @keyframes shimmer {
      0% {
        background-position: 200% center;
      }
      100% {
        background-position: 0% center;
      }
    }
    /* Pop-up styling */
    #donate-popup {
      display: none;
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background-color: rgba(0, 0, 0, 0.5);
      justify-content: center;
      align-items: center;
    }

    #donate-popup-content {
      background-color: #1f2937;
      padding: 2rem;
      border-radius: 10px;
      text-align: center;
      max-width: 400px;
      width: 100%;
    }

    #donate-popup-content img {
      max-width: 100%;
      height: auto;
    }

    /* Button Positioning and Size */
    .button-container {
      display: flex;
      justify-content: space-between;
      width: 100%;
      max-width: 500px;
      margin-top: 20px;
      margin-bottom: 30px; /* Tambahan JARAK bawah */
      
    }

    .button-container button {
      flex: 1;
      max-width: 120px; /* Membatasi lebar tombol */
      font-size: 0.875rem; /* Ukuran font lebih kecil */
      padding: 8px 16px; /* Padding lebih kecil */
      margin: 0 5px; /* Jarak antar tombol */
    }

    /* Button Hover Effects */
    .button-container button:hover {
      opacity: 0.9;
    }
      </style>
  </head>
  <body>
      <div class="container">
   <!-- Neon CLUB GRATIS -->
        <h1 class="glow-box-content w-full mt-2 mb-5"> CLUB GRATIS </h1>
          
          <h1>Tambahkan sertifikat SSL secara otomatis ke nama domain</h1>
          
    <!-- Button Donate and Link (aligned left and right) -->
    <div class="button-container mb-4">
      <!-- Donate Button -->
      <button id="donate-button" onclick="openDonatePopup()" class="group bg-transparent text-pink-500 rounded-lg hover:bg-transparent flex items-center justify-center transition">
  <i class="fas fa-donate mr-2 text-pink-400 group-hover:text-pink-300 transition"></i>
  <span class="group-hover:text-pink-200 transition">Donate</span>
</button>

      <!-- Link Button -->
      <button id="link-button" onclick="openLink()" class="group bg-transparent text-blue-500 rounded-lg hover:bg-transparent flex items-center justify-center transition">
  <i class="fas fa-house mr-2 text-blue-400 group-hover:text-blue-300 transition"></i>
  <span class="group-hover:text-blue-200 transition">Home</span>
</button>
    </div>
          
          <a href="https://tb.netassist.ua" class="register-btn" target="_blank">Daftarkan nama domain gratis</a>
          
  <!-- Donate QR Popup -->
  <div id="donate-popup" class="flex justify-center items-center">
    <div id="donate-popup-content">
      <h2 class="text-xl font-semibold text-white mb-4">Scan QR to Donate</h2>
      <img src="https://raw.githubusercontent.com/MarinaAqua/MarinaAqua/main/qr-donate.jpg" alt="QR Code" />
      <button onclick="closeDonatePopup()" class="mt-4 bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-500 focus:outline-none focus:ring-2 focus:ring-red-500">Close</button>
    </div>
  </div>
          
          <form id="ssl-form">
              <div class="form-group">
                  <label for="email">Alamat Email Cloudflare Anda (Email)</label>
                  <input type="email" id="email" placeholder="Silakan masukkan alamat email Cloudflare Anda">
                  <div class="error-message" id="email-error">Silakan masukkan alamat email yang valid</div>
              </div>
              
              <div class="form-group">
                  <label for="zone-id">ID Zone Domain (Zone ID)</label>
                  <input type="text" id="zone-id" placeholder="Silakan masukkan ID Zone Domain Anda">
                  <div class="error-message" id="zone-id-error">Silakan masukkan ID Zone yang valid</div>
              </div>
              
              <div class="form-group">
                  <label for="api-key">Kunci API Global (API Key)</label>
                  <input type="text" id="api-key" placeholder="Silakan masukkan kunci API Anda">
                  <div class="error-message" id="api-key-error">Silakan masukkan kunci API Anda</div>
              </div>
              
              <button type="submit" class="btn" id="submit-btn">
                  <div class="spinner" id="spinner"></div>
                  <span id="btn-text">Tambahkan Sertifikat SSL</span>
              </button>
          </form>
          
          <div class="result" id="result-message"></div>
          
          <div class="info-box">
              <h3>Instruksi</h3>
              <p>1. Pastikan Anda telah memasukkan informasi akun Cloudflare yang benar.</p>
              <p>2. Pastikan domain ip6.arpa Anda diaktifkan di Cloudflare sebelum menambahkannya.</p>
              <p>3. Setelah berhasil menambahkan, harap tunggu 10 menit lalu periksa sertifikat SSL/TLS di menu domain</p>
              <p>4. Alat ini menggunakan Cloudflare API untuk menambahkan sertifikat SSL ke domain IPV6 Anda</p>
          </div>
          
          <div class="footer">
              <p>Perhatian: Kunci API Anda hanya digunakan untuk permintaan ini, Tidak akan disimpan</p>
          </div>
  <footer class="social-footer">
  <a href="https://github.com/MarinaAqua" target="_blank">
    <i class="fab fa-github text-gray-400 hover:text-white transition"></i>
  </a>
  <a href="https://youtube.com/@mrkingsofficial6366" target="_blank">
    <i class="fab fa-youtube text-red-500 hover:text-red-400 transition"></i>
  </a>
  <a href="https://t.me/club_gratis" target="_blank">
    <i class="fab fa-telegram text-blue-400 hover:text-blue-300 transition"></i>
  </a>
</footer>

  <div class="rainbow-text mb-8">
    <a class="text-1xl">CLUB GRATIS</a>
    </div>
          <div class="copyright-footer">
            &copy; <span id="year"></span> Club Gratis. Allrights reserved.
            </div>
          
      </div>
  
      <script>
          document.getElementById('ssl-form').addEventListener('submit', async function(e) {
              e.preventDefault();
              
              // Get input value
              const email = document.getElementById('email').value.trim();
              const zoneId = document.getElementById('zone-id').value.trim();
              const apiKey = document.getElementById('api-key').value.trim();
              
              // Reset error status
              resetErrors();
              
              // Validating Input
              let isValid = true;
              
              if (!email) {
                  showError('email', 'Silakan masukkan alamat email yang valid');
                  isValid = false;
              }
              
              if (!zoneId) {
                  showError('zone-id', 'Silakan masukkan ID wilayah');
                  isValid = false;
              }
              
              if (!apiKey) {
                  showError('api-key', 'Silakan masukkan kunci API Anda');
                  isValid = false;
              }
              
              if (!isValid) return;
              
              // Show loading status
              document.getElementById('spinner').style.display = 'block';
              document.getElementById('btn-text').textContent = 'Adding...';
              document.getElementById('submit-btn').disabled = true;
              
              try {
                  // Send request to Worker API
                  const response = await fetch('/api/add-ssl', {
                      method: 'POST',
                      headers: {
                          'Content-Type': 'application/json',
                      },
                      body: JSON.stringify({
                          email: email,
                          zone_id: zoneId,
                          api_key: apiKey
                      })
                  });
                  
                  const data = await response.json();
                  
                  // Display results
                  if (data.success) {
                      showResult('Sertifikat berhasil ditambahkan，Silakan periksa sertifikat SSL/TLS untuk domain ini di Cloudflare setelah 10 menit.', 'success');
                  } else {
                      let errorMsg = 'Gagal menambahkan sertifikat';
                      if (data.errors && data.errors.length > 0) {
                          errorMsg += ': ' + data.errors[0].message;
                      }
                      showResult(errorMsg, 'error');
                  }
              } catch (error) {
                  showResult('Permintaan gagal, Harap periksa koneksi jaringan Anda', 'error');
                  console.error('Error:', error);
              } finally {
                  // Hide loading status
                  document.getElementById('spinner').style.display = 'none';
                  document.getElementById('btn-text').textContent = 'Menambahkan Sertifikat SSL';
                  document.getElementById('submit-btn').disabled = false;
              }
          });
          
          function showError(fieldId, message) {
              const field = document.getElementById(fieldId);
              const errorElement = document.getElementById(\`\${fieldId}-error\`);
              
              field.classList.add('error');
              errorElement.textContent = message;
              errorElement.style.display = 'block';
              
              // Focus on the first error field
              if (!document.querySelector('.error:focus')) {
                  field.focus();
              }
          }
          
          function resetErrors() {
              const errorFields = document.querySelectorAll('.error');
              const errorMessages = document.querySelectorAll('.error-message');
              
              errorFields.forEach(field => {
                  field.classList.remove('error');
              });
              
              errorMessages.forEach(message => {
                  message.style.display = 'none';
              });
          }
          
          function showResult(message, type) {
              const resultElement = document.getElementById('result-message');
              resultElement.textContent = message;
              resultElement.className = 'result';
              resultElement.classList.add(type === 'success' ? 'success' : 'error-result');
              resultElement.style.display = 'block';
              
              // Scroll to results
              resultElement.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
          }
      </script>
       <script>
    // Fungsi untuk menampilkan pop-up QR
    function openDonatePopup() {
      document.getElementById('donate-popup').style.display = "flex";
    }

    // Fungsi untuk menutup pop-up QR
    function closeDonatePopup() {
      document.getElementById('donate-popup').style.display = "none";
    }

    // Fungsi untuk membuka Link yang dituju
    function openLink() {
      // Masukkan URL yang ingin ditampilkan
      const url = "https://clubgratis.biz.id"; // Ganti URL sesuai kebutuhan
      window.open(url, '_blank');  // Membuka URL di tab baru
    }
    document.getElementById('year').textContent = new Date().getFullYear();
    </script>
  </body>
  </html>`;
  }
