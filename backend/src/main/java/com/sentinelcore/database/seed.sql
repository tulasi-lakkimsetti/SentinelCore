INSERT	INTO	asset	(asset_name,	asset_type,	ip_address,	cpu_usage,	
memory_usage,	disk_usage,	network_usage,	status)
VALUES
('WebServer-01',	'Server',	'192.168.1.10',	45.2,	60.1,	70.5,	30.2,	
'ONLINE'),
('DBServer-01',	'Database',	'192.168.1.11',	78.5,	82.3,	55.0,	20.1,	
'WARNING'),
('Router-01',	'Network',	'192.168.1.1',	12.0,	25.0,	10.0,	55.0,	
'ONLINE'),
('Firewall-01',	'Security',	'192.168.1.2',	5.0,	15.0,	8.0,	12.0,	
'ONLINE'),
('AppServer-02',	'Server',	'192.168.1.12',	92.0,	88.0,	90.0,	40.0,	
'CRITICAL');

-- Roles
INSERT INTO roles (name)
VALUES
('ROLE_ADMIN'),
('ROLE_OPERATOR'),
('ROLE_VIEWER');

-- Admin user
INSERT INTO users (username, password, email)
VALUES (
    'admin',
    '<BCrypt_HASH_FOR_admin123>',
    'admin@sentinelcore.local'
);

-- Connect admin user to ROLE_ADMIN
INSERT INTO user_roles (user_id, role_id)
SELECT u.id, r.id
FROM users u, roles r
WHERE u.username = 'admin'
  AND r.name = 'ROLE_ADMIN';