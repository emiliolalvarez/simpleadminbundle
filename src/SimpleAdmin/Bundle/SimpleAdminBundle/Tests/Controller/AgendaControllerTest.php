<?php
namespace SimpleAdmin\Bundle\SimpleAdminBundle\Tests\Controller;

use SimpleAdmin\Bundle\SimpleAdminBundle\Controller\AgendaController;

class AgendaControllerTest extends \PHPUnit_Framework_TestCase
{
    public function testAdd()
    {
        $agenda = new AgendaController();

        $this->assertEquals(1, $agenda->getTestNumber());
    }
}