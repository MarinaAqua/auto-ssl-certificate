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
  <html lang="zh-CN">
  <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Tambahkan sertifikat SSL secara otomatis ke nama domain</title>
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
      </style>
  </head>
  <body>
      <div class="container">
          <h1>Tambahkan sertifikat SSL secara otomatis ke nama domain</h1>
          
          <h1>CLUB GRATIS</h1>
          
          <a href="https://tb.netassist.ua" class="register-btn" target="_blank">Daftarkan nama domain gratis</a>
          
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
  </body>
  </html>`;
  }
