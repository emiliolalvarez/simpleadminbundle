<?php
namespace SimpleAdmin\Bundle\SimpleAdminBundle\Entity;

use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Validator\Constraints as Assert;
use Symfony\Bridge\Doctrine\Validator\Constraints\UniqueEntity;
use JMS\Serializer\Annotation as JMS;


/**
 * @ORM\Entity
 * @ORM\Table()
 */
class Country{

  /**
   * @ORM\Id
   * @ORM\Column(type="integer")
   * @ORM\GeneratedValue(strategy="AUTO")
   */
  protected $id;

  /**
   * @ORM\Column(type="string")
   */
  protected $name;


  public function setName($name){
    $this->name = $name;
  }

  public function getName(){
    return $this->name;
  }

  public function getId(){
    return $this->getId();
  }

}