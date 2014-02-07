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
Class Person{

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

    /**
     * @ORM\Column(type="string")
     */
    protected $lastName;

    /**
     * @ORM\OneToOne(targetEntity="Media", cascade={"persist","remove"}, orphanRemoval=true)
     * @JMS\MaxDepth(1)
     */
    protected $photo;

    /**
     * @ORM\ManyToOne(targetEntity="Country")
     * @JMS\MaxDepth(1)
     */
    protected $country;

    public function setName($name){
        $this->name = $name;
    }

    public function getName(){
        return $this->name;
    }

    public function setLastName($lastName){
        $this->lastName = $lastName;
    }

    public function getLastName(){
        return $this->lastName;
    }

    public function setPhoto($photo)
    {
        $this->photo = $photo;
    }

    public function getPhoto()
    {
        return $this->photo;
    }

    public function getId(){
        return $this->getId();
    }
}