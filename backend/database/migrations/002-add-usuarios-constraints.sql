ALTER TABLE usuarios
ADD CONSTRAINT usuarios_idade_check
CHECK (idade >= 0);

ALTER TABLE usuarios
ADD CONSTRAINT usuarios_role_check
CHECK (role IN ('usuario', 'admin'));