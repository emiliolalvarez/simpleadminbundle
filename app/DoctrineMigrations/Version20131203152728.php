<?php

namespace Application\Migrations;

use Doctrine\DBAL\Migrations\AbstractMigration;
use Doctrine\DBAL\Schema\Schema;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
class Version20131203152728 extends AbstractMigration
{
    public function up(Schema $schema)
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->abortIf($this->connection->getDatabasePlatform()->getName() != "mysql", "Migration can only be executed safely on 'mysql'.");
        
        $this->addSql("ALTER TABLE Gallery CHANGE context context VARCHAR(64) NOT NULL");
        $this->addSql("ALTER TABLE GalleryHasMedia ADD gallery_id INT DEFAULT NULL, ADD media_id INT DEFAULT NULL");
        $this->addSql("ALTER TABLE GalleryHasMedia ADD CONSTRAINT FK_9615D9D14E7AF8F FOREIGN KEY (gallery_id) REFERENCES Gallery (id)");
        $this->addSql("ALTER TABLE GalleryHasMedia ADD CONSTRAINT FK_9615D9D1EA9FDD75 FOREIGN KEY (media_id) REFERENCES Media (id)");
        $this->addSql("CREATE INDEX IDX_9615D9D14E7AF8F ON GalleryHasMedia (gallery_id)");
        $this->addSql("CREATE INDEX IDX_9615D9D1EA9FDD75 ON GalleryHasMedia (media_id)");
        $this->addSql("ALTER TABLE Media CHANGE context context VARCHAR(64) DEFAULT NULL");
    }

    public function down(Schema $schema)
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->abortIf($this->connection->getDatabasePlatform()->getName() != "mysql", "Migration can only be executed safely on 'mysql'.");
        
        $this->addSql("ALTER TABLE Gallery CHANGE context context VARCHAR(255) NOT NULL");
        $this->addSql("ALTER TABLE GalleryHasMedia DROP FOREIGN KEY FK_9615D9D14E7AF8F");
        $this->addSql("ALTER TABLE GalleryHasMedia DROP FOREIGN KEY FK_9615D9D1EA9FDD75");
        $this->addSql("DROP INDEX IDX_9615D9D14E7AF8F ON GalleryHasMedia");
        $this->addSql("DROP INDEX IDX_9615D9D1EA9FDD75 ON GalleryHasMedia");
        $this->addSql("ALTER TABLE GalleryHasMedia DROP gallery_id, DROP media_id");
        $this->addSql("ALTER TABLE Media CHANGE context context VARCHAR(16) DEFAULT NULL");
    }
}
