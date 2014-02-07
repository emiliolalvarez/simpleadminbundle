<?php

namespace Application\Migrations;

use Doctrine\DBAL\Migrations\AbstractMigration;
use Doctrine\DBAL\Schema\Schema;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
class Version20140207121634 extends AbstractMigration
{
    public function up(Schema $schema)
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->abortIf($this->connection->getDatabasePlatform()->getName() != "mysql", "Migration can only be executed safely on 'mysql'.");
        
        $this->addSql("ALTER TABLE Person ADD country_id INT DEFAULT NULL");
        $this->addSql("ALTER TABLE Person ADD CONSTRAINT FK_3370D440F92F3E70 FOREIGN KEY (country_id) REFERENCES Country (id)");
        $this->addSql("CREATE UNIQUE INDEX UNIQ_3370D440F92F3E70 ON Person (country_id)");
    }

    public function down(Schema $schema)
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->abortIf($this->connection->getDatabasePlatform()->getName() != "mysql", "Migration can only be executed safely on 'mysql'.");
        
        $this->addSql("ALTER TABLE Person DROP FOREIGN KEY FK_3370D440F92F3E70");
        $this->addSql("DROP INDEX UNIQ_3370D440F92F3E70 ON Person");
        $this->addSql("ALTER TABLE Person DROP country_id");
    }
}
