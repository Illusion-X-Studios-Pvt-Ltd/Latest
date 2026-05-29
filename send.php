<?php
/**
 * send.php — Contact form mailer
 * Uses PHPMailer + Hostinger SMTP
 *
 * FOLDER STRUCTURE ON YOUR SERVER:
 * public_html/
 *   ├── contact.html
 *   ├── send.php           ← this file
 *   └── phpmailer/
 *       ├── Exception.php
 *       ├── PHPMailer.php
 *       └── SMTP.php
 *
 * HOW TO GET PHPMAILER FILES:
 * Download from https://github.com/PHPMailer/PHPMailer/tree/master/src
 * You need just these 3 files: Exception.php, PHPMailer.php, SMTP.php
 * Upload them into a folder called "phpmailer/" next to this file.
 */

header('Content-Type: application/json; charset=utf-8');

// Block anything that isn't a POST request
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Method not allowed']);
    exit;
}

// ── Load PHPMailer ────────────────────────────────────────────────────────────
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\SMTP;
use PHPMailer\PHPMailer\Exception;

require __DIR__ . '/phpmailer/Exception.php';
require __DIR__ . '/phpmailer/PHPMailer.php';
require __DIR__ . '/phpmailer/SMTP.php';

// ── Parse incoming JSON from the fetch() call ─────────────────────────────────
$raw  = file_get_contents('php://input');
$data = json_decode($raw, true);

if (!$data) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Invalid request']);
    exit;
}

// ── Sanitize inputs ───────────────────────────────────────────────────────────
$name    = trim(strip_tags($data['name']    ?? ''));
$email   = filter_var(trim($data['email']   ?? ''), FILTER_VALIDATE_EMAIL);
$company = trim(strip_tags($data['company'] ?? ''));
$service = trim(strip_tags($data['service'] ?? ''));
$budget  = trim(strip_tags($data['budget']  ?? ''));
$message = trim(strip_tags($data['message'] ?? ''));

if (!$name || !$email || !$message) {
    http_response_code(422);
    echo json_encode(['success' => false, 'message' => 'Name, email, and message are required']);
    exit;
}

// ── Send via PHPMailer ────────────────────────────────────────────────────────
$mail = new PHPMailer(true);

try {
    // ┌─────────────────────────────────────────────────────────────────────┐
    // │  HOSTINGER SMTP — fill in your credentials below                   │
    // └─────────────────────────────────────────────────────────────────────┘
    $mail->isSMTP();
    $mail->Host       = 'smtp.hostinger.com';
    $mail->SMTPAuth   = true;
    $mail->Username   = 'admin@illusionxstudios.com'; // 👈 your Hostinger email
    $mail->Password   = 'Xstudios422@';         // 👈 your Hostinger email password
    $mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;
    $mail->Port       = 587;
    $mail->CharSet    = 'UTF-8';

    // ── Who it's from / where replies go ──────────────────────────────────
    $mail->setFrom('admin@illusionxstudios.com', 'illusionxstudios Website');
    $mail->addAddress('admin@illusionxstudios.com', 'illusionxstudios');
    $mail->addReplyTo($email, $name); // Hit "Reply" in your inbox → goes to the enquirer

    // ── Email content ─────────────────────────────────────────────────────
    $mail->isHTML(true);
    $mail->Subject = "New Enquiry: {$name} — illusionxstudios";
    $mail->Body    = buildHTML($name, $email, $company, $service, $budget, $message);
    $mail->AltBody = buildText($name, $email, $company, $service, $budget, $message);

    $mail->send();
    echo json_encode(['success' => true]);

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'Mail error: ' . $mail->ErrorInfo
    ]);
}


// ─────────────────────────────────────────────────────────────────────────────
// Email templates
// ─────────────────────────────────────────────────────────────────────────────

function row($label, $value) {
    return "
    <tr>
      <td style='padding:10px 0;color:#00D4FF;font-size:11px;letter-spacing:1.5px;
                 text-transform:uppercase;width:110px;vertical-align:top;'>
        {$label}
      </td>
      <td style='padding:10px 0 10px 16px;color:#ddd;font-size:14px;
                 line-height:1.6;vertical-align:top;'>
        {$value}
      </td>
    </tr>";
}

function buildHTML($name, $email, $company, $service, $budget, $message) {
    $msg = nl2br(htmlspecialchars($message));
    return '
<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#0a0f1e;font-family:Arial,Helvetica,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0"
         style="background:#0a0f1e;padding:40px 16px;">
    <tr><td align="center">
      <table width="560" cellpadding="0" cellspacing="0"
             style="background:#0e1628;border:1px solid rgba(0,212,255,0.2);
                    border-radius:14px;overflow:hidden;max-width:100%;">

        <!-- Header -->
        <tr>
          <td style="background:linear-gradient(135deg,#001830 0%,#002855 100%);
                     padding:28px 32px;border-bottom:1px solid rgba(0,212,255,0.15);">
            <p style="margin:0;color:#00D4FF;font-size:22px;font-weight:700;
                      letter-spacing:3px;text-transform:uppercase;">
              ILLUSIONX STUDIOS
            </p>
            <p style="margin:6px 0 0;color:rgba(255,255,255,0.45);font-size:11px;
                      letter-spacing:2px;text-transform:uppercase;">
              New Project Enquiry
            </p>
          </td>
        </tr>

        <!-- Details -->
        <tr>
          <td style="padding:28px 32px 8px;">
            <table width="100%" cellpadding="0" cellspacing="0">
              ' . row('Name',    htmlspecialchars($name))
                . row('Email',   '<a href="mailto:'.htmlspecialchars($email).'"
                                     style="color:#00D4FF;text-decoration:none;">'.htmlspecialchars($email).'</a>')
                . row('Company', $company ? htmlspecialchars($company) : '<span style="color:#555;">—</span>')
                . row('Service', $service ? htmlspecialchars($service) : '<span style="color:#555;">—</span>')
                . row('Budget',  $budget  ? htmlspecialchars($budget)  : '<span style="color:#555;">—</span>') . '
            </table>
          </td>
        </tr>

        <!-- Message -->
        <tr>
          <td style="padding:4px 32px 32px;">
            <p style="margin:0 0 10px;color:#00D4FF;font-size:11px;letter-spacing:1.5px;
                      text-transform:uppercase;">
              Message
            </p>
            <div style="padding:16px 20px;background:rgba(255,255,255,0.04);
                        border-left:2px solid rgba(0,212,255,0.4);border-radius:0 8px 8px 0;
                        color:#ccc;font-size:14px;line-height:1.75;">
              ' . $msg . '
            </div>
          </td>
        </tr>

        <!-- Footer -->
        <tr>
          <td style="padding:16px 32px 24px;border-top:1px solid rgba(255,255,255,0.05);
                     text-align:center;color:rgba(255,255,255,0.25);font-size:11px;">
            Sent from illusionxstudios.com · ' . date('d M Y, H:i') . ' IST
          </td>
        </tr>

      </table>
    </td></tr>
  </table>
</body>
</html>';
}

function buildText($name, $email, $company, $service, $budget, $message) {
    return "New project enquiry — illusionxstudios.com\n"
         . str_repeat('-', 42) . "\n"
         . "Name:    {$name}\n"
         . "Email:   {$email}\n"
         . "Company: " . ($company ?: '—') . "\n"
         . "Service: " . ($service ?: '—') . "\n"
         . "Budget:  " . ($budget  ?: '—') . "\n\n"
         . "Message:\n{$message}\n";
}
